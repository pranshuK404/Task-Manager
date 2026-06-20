import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { taskPermissions } from "../../utils/task/taskPermission.js";
import { isOverDue } from "../../utils/task/isOverDue.js";

export const getTaskSubTasks = asyncHandler(async (req, res) => {
  const taskId = req.params?.taskId?.trim();
  const userId = req.user?._id;
  const { status, priority } = req.query;

  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const permissions = taskPermissions(task, userId);

  if (!permissions.isOwner && !permissions.isCollaborator) {
    throw new ApiError(
      403,
      "You do not have permission to view subtasks of this task",
    );
  }

  //---SUBTASK FILTERS
  const subTaskQuery = {
    task: taskId,
  };

  if (status) {
    subTaskQuery.status = status;
  }

  if (priority) {
    subTaskQuery.priority = priority;
  }

  const subTasks = await SubTask.find(subTaskQuery)
    .select("_id title status dueDate")
    .lean();

  const subTasksWithOverdue = subTasks.map((subTask) => ({
    ...subTask,
    isOverDue: isOverDue(subTask),
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subTasksWithOverdue,
        "Subtasks retrieved successfully",
      ),
    );
});
