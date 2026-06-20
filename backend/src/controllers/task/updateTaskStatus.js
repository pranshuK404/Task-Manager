import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params?.taskId;
  const { status } = req.body;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found or you don't have permission to update it",
    );
  }
  if (task.status === status) {
    throw new ApiError(400, `Task is already marked as ${status}`);
  }
  if (status === "completed") {
    throw new ApiError(
      400,
      "Task cannot be marked as completed until all subtasks are completed",
    );
  }

  task.status = status;
  const updatedTask = await task.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { status: updatedTask.status },
        "Task status updated successfully",
      ),
    );
});
