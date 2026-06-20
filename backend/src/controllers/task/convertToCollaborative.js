import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const convertToCollaborative = asyncHandler(async (req, res) => {
  const taskId = req.params?.taskId;
  const userId = req.user?.id;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found or you don't have permission to access it",
    );
  }

  if (task.taskType === "collaborative") {
    throw new ApiError(400, "Task is already collaborative");
  }

  task.taskType = "collaborative";

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTask.toJSON(),
        "Task converted to collaborative successfully",
      ),
    );
});
