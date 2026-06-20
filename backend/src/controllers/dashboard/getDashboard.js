import { asyncHandler } from "../../utils/asyncHandler.js";
import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { isOverDue } from "../../utils/task/isOverDue.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tasks = await Task.find({
    $or: [{ createdBy: userId }, { collaborators: userId }],
  }).lean();

  const totalTasks = tasks.length;

  const totalOwnerTasks = tasks.filter(
    (task) => task.createdBy.toString() === userId.toString(),
  ).length;

  const totalCollaboratorTasks = tasks.filter((task) =>
    task.collaborators.some(
      (collaborator) => collaborator.toString() === userId.toString(),
    ),
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;

  const overdueTasks = tasks.filter((task) => isOverDue(task)).length;

  const personalTasks = tasks.filter(
    (task) => task.taskType === "personal",
  ).length;

  const collaborativeTasks = tasks.filter(
    (task) => task.taskType === "collaborative",
  ).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalTasks,
        totalOwnerTasks,
        totalCollaboratorTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        personalTasks,
        collaborativeTasks,
      },
      "Dashboard retrieved successfully",
    ),
  );
});
