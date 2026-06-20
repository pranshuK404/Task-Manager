import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { SubTask } from "../../models/subTask.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params?.taskId;
  const userId = req.user._id;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found or you do not have permission to delete it",
    );
  }

  await SubTask.deleteMany({ task: taskId });

  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});
