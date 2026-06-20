export const taskPermissions = (task, userId) => {
  const isPersonal = task.taskType === "personal";

  const isCollaborative = task.taskType === "collaborative";

  const isOwner = task.createdBy.toString() === userId.toString();

  const isCollaborator = task.collaborators?.some(
    (id) => id.toString() === userId.toString(),
  );

  return {
    isOwner,
    isCollaborator,
    isPersonal,
    isCollaborative,

    canViewTask: isOwner || isCollaborator ,
    canEditTask: isOwner ,
    canDeleteTask: isOwner,
    canViewSubtasks: isOwner || isCollaborator,
    canViewCollaborators: (isOwner || isCollaborator) && isCollaborative,
    canManageCollaborators: isOwner && isCollaborative,
    canAssignSubtasks: isOwner && isCollaborative,
  };
};
