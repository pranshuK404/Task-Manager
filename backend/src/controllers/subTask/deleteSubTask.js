import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { syncTaskState } from "../../utils/task/syncTaskState.js";
import { removeCollaborator } from "../../utils/task/syncTaskCollaborators.js";

export const deleteSubTask = asyncHandler(async (req, res) => {
  const subtaskId = req.params?.subtaskId;
  const userId = req.user?._id;

  const subtask = await SubTask.findOne({ _id: subTaskId, createdBy: userId });

  if (!subtask) {
    throw new ApiError(
      404,
      "Subtask not found or you don't have permission to delete it",
    );
  }
  const taskId = subtask.task;
  const assignedUser = subtask.assignedTo;

  await subtask.deleteOne();

  if (assignedUser) {
    await removeCollaborator(taskId, assignedUser);
  }

  await sycnTaskState(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subtask deleted successfully"));
});
