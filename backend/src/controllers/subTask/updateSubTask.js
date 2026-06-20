import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { taskPermissions } from "../../utils/task/taskPermission.js";

export const updateSubTask = asyncHandler(async (req, res) => {
  const subTaskId = req.params.subTaskId;
  const userId = req.user._id;
  const { title, description, priority, dueDate } = req.body;

  const subTask = await SubTask.findById(subTaskId);

  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findOne({
    _id: subTask.task,
    $or: [{ createdBy: userId }, { collaborators: userId }],
  });

  if (!task) {
    throw new ApiError(
      403,
      "You do not have permission to update this subtask",
    );
  }

  const permissions = taskPermissions(task, userId);

  const canEditSubtask =
    permissions.isOwner ||
    (permissions.isCollaborator &&
      subTask.assignedTo?.toString() === userId.toString());

  if (!canEditSubtask) {
    throw new ApiError(
      403,
      "You do not have permission to update this subtask",
    );
  }

  if (title !== undefined) subTask.title = title;
  if (description !== undefined) subTask.description = description;
  if (priority !== undefined) subTask.priority = priority;
  if (dueDate !== undefined) {
    if (new Date(dueDate) < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past");
    }

    subTask.dueDate = dueDate;
  }

  const updatedSubTask = await subTask.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSubTask.toJSON(),
        "Subtask updated successfully",
      ),
    );
});
