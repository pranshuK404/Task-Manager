import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { SubTask } from "../../models/subTask.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { isOverDue } from "../../utils/task/isOverDue.js";

export const getTask = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params.taskId;

  const task = await Task.findOne({
    _id: taskId,
    $or: [{ createdBy: userId }, { collaborators: userId }],
  })
    .select("-__v -createdAt -updatedAt")
    .lean();

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const isTaskOverDue = isOverDue(task);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...task, isOverDue: isTaskOverDue },
        "Task retrieved successfully",
      ),
    );
});
