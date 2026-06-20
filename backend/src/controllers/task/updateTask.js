import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params.taskId;

  const { title, description, priority, dueDate } = req.body;

  const task = await Task.findOne({ _id: taskId, createdBy: userId });

  if (!task) {
    throw new ApiError(
      404,
      "Task not found or you don't have permission to update this task",
    );
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) {
    if (new Date(dueDate) < new Date()) {
      throw new ApiError(400, "Due date cannot be set in the past");
    }
    task.dueDate = dueDate;
  }

  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask.toJSON(), "Task updated successfully"),
    );
});
