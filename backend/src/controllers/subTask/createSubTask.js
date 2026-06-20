import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Task } from "../../models/task.model.js";
import { taskPermissions } from "../../utils/task/taskPermission.js";
import { addCollaborator } from "../../utils/task/syncTaskCollaborators.js";
import { syncTaskState } from "../../utils/task/syncTaskState.js";

export const createSubTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params.taskId;

  const {
    title,
    description,
    assignedTo, // email from frontend
    dueDate,
    priority,
  } = req.body;

  const parentTask = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  });

  if (!parentTask) {
    throw new ApiError(404, "Task not found");
  }

  const permissions = taskPermissions(parentTask, userId);

  // Only owner can create subtasks
  if (permissions.isCollaborative && !permissions.isOwner) {
    throw new ApiError(
      403,
      "Only the task owner can create sub-tasks in a collaborative task",
    );
  }

  let finalAssignedTo = null;

  // Personal task -> always assign to owner
  if (permissions.isPersonal) {
    if (assignedTo) {
      throw new ApiError(
        400,
        "Personal tasks cannot be assigned to other users",
      );
    }

    finalAssignedTo = userId;
  }

  // Collaborative task -> email lookup
  if (permissions.isCollaborative && assignedTo) {
    const assignee = await User.findOne({
      email: assignedTo,
    }).select("_id");

    if (!assignee) {
      throw new ApiError(
        404,
        "No registered user found with this email address",
      );
    }

    finalAssignedTo = assignee._id;
  }

  const subTask = await SubTask.create({
    title,
    createdBy: userId,
    task: taskId,
    description,
    assignedTo: finalAssignedTo,
    dueDate,
    priority,
  });

  // Add collaborator if assigned user isn't owner
  if (
    permissions.isCollaborative &&
    finalAssignedTo &&
    finalAssignedTo.toString() !== userId.toString()
  ) {
    await addCollaborator(taskId, finalAssignedTo);
  }

  await syncTaskState(taskId);

  return res
    .status(201)
    .json(
      new ApiResponse(201, subTask.toJSON(), "Sub-task created successfully"),
    );
});
