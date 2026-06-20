import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { Task } from "../../models/task.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  addCollaborator,
  removeCollaborator,
} from "../../utils/task/syncTaskCollaborators.js";

export const assignSubTask = asyncHandler(async (req, res) => {
  const subtaskId = req.params.subtaskId;
  const userId = req.user._id;

  const { assigneeEmail } = req.body;

  // Find assignee by email
  const assignee = await User.findOne({
    email: assigneeEmail,
  }).select("_id");

  if (!assignee) {
    throw new ApiError(
      404,
      "No registered user found with this email address",
    );
  }

  const assigneeId = assignee._id;

  const subtask = await SubTask.findById(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Only task owner can assign
  const task = await Task.findOne({
    _id: subtask.task,
    createdBy: userId,
  });

  if (!task) {
    throw new ApiError(
      403,
      "You do not have permission to assign this subtask",
    );
  }

  if (task.taskType === "personal") {
    throw new ApiError(
      403,
      "Personal task cannot be assigned to another user",
    );
  }

  if (
    subtask.assignedTo &&
    subtask.assignedTo.toString() === assigneeId.toString()
  ) {
    throw new ApiError(
      400,
      "Subtask is already assigned to this user",
    );
  }

  const previousAssignee = subtask.assignedTo;

  subtask.assignedTo = assigneeId;

  const updatedSubtask = await subtask.save();

  // Add new collaborator if not owner
  if (assigneeId.toString() !== userId.toString()) {
    await addCollaborator(task._id, assigneeId);
  }

  // Remove old collaborator if needed
  if (
    previousAssignee &&
    previousAssignee.toString() !== userId.toString()
  ) {
    await removeCollaborator(task._id, previousAssignee);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedSubtask.toJSON(),
      "Subtask assigned successfully",
    ),
  );
});