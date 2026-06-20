import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, taskType, priority, dueDate } = req.body;

  if (dueDate && new Date(dueDate) < new Date()) {
    throw new ApiError(400, "Due date cannot be in the past");
  }

  const task = await Task.create({
    title,
    createdBy: req.user._id,
    description,
    taskType,
    priority,
    dueDate,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});
