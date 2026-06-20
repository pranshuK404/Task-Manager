import { Task } from "../../models/task.model.js";

export const addCollaborator = async (taskId, userId) => {
  await Task.findByIdAndUpdate(taskId, {
    $addToSet: {
      collaborators: userId,
    },
  });
};

export const removeCollaborator = async (taskId, userId) => {
  const hasAssignedSubtasks = await SubTask.exists({
    task: taskId,
    assignedTo: userId,
  });

  if (hasAssignedSubtasks) {
    return;
  }

  await Task.findByIdAndUpdate(taskId, {
    $pull: {
      collaborators: userId,
    },
  });
};
