import { Task } from "../../models/task.model.js";
import { SubTask } from "../../models/subTask.model.js";
import { ApiError } from "../ApiError.js";

export const syncTaskState = async (taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await SubTask.find({
    task: taskId,
  }).select("status").lean();

  //--CALCULATE SUBTASKS COUNT
  task.subtasksCount = subtasks.length;

  //--CALCULATE COMPLETED SUBTASKS COUNT
  const completedCount = subtasks.filter(
    (subtask) => subtask.status === "completed",
  ).length;

  //--DETERMINE TASK STATUS BASED ON SUBTASKS STATUS
  if (subtasks.length === 0) {
    task.status = "pending";
    task.completedAt = null;
  } else if (completedCount === subtasks.length) {
    task.status = "completed";
    task.completedAt = new Date();
  } else {
    task.status = "in progress";
    task.completedAt = null;
  }

  await task.save({
    validateBeforeSave: false,
  });
};
