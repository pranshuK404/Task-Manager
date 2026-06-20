import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { taskPermissions } from "../../utils/task/taskPermission.js";
import {isOverDue} from "../../utils/task/isOverDue.js"

export const getSubTask = asyncHandler(async (req, res) => {
  const subtaskId = req.params?.subtaskId;
  const userId = req.user?._id;

  const subtask = await SubTask.findOne({
    _id: subtaskId, $or: [{ createdBy: userId }, { collaborators: userId }],
})
    .populate("assignedTo", "username email avatar")
    .lean();

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findById(subtask.task)
    .select("createdBy collaborators taskIdentity")
    .lean();

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //--CHECK IF USER IS CREATOR OR COLLABORATOR OF THE TASK TO WHICH THE SUBTASK BELONGS

  const permissions = taskPermissions(task, userId);

  if (!permissions.isOwner && !permissions.isCollaborator) {
    throw new ApiError(403, "You do not have permission to view this subtask");
  }

  const isSubTaskOverDue = isOverDue(task);
  return res
    .status(200)
    .json(new ApiResponse(200, {...subtask , isOverDue: isSubTaskOverDue}, "Subtask retrieved successfully"));
});
