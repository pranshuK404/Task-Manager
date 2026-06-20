import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { isOverDue } from "../../utils/task/isOverDue.js";

export const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { taskType, status, priority, sortBy } = req.query;

  //---FILTERING TASKS
  const taskQuery = {
    $or: [{ createdBy: userId }, { collaborators: userId }],
  };

  if (taskType) {
    taskQuery.taskType = taskType;
  }

  if (status) {
    taskQuery.status = status;
  }

  if (priority) {
    taskQuery.priority = priority;
  }

  //---SORTING TASKS
  let sortOptions = { createdAt: -1 };
  if (sortBy) {
    if (sortBy === "dueDate") {
      sortOptions = { dueDate: 1 };
    } else {
      sortOptions = { [sortBy]: -1 };
    }
  }

  const tasks = await Task.find(taskQuery)
    .select(
      "_id title status dueDate createdBy priority subtasksCount taskType",
    )
    .sort(sortOptions)
    .lean();

  const tasksWithOverdue = tasks.map((task) => ({
    ...task,
    isOverDue: isOverDue(task),
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, tasksWithOverdue, "Tasks retrieved successfully"),
    );
});
