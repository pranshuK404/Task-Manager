export const isOverDue = (item) => {
  return (
    item.status !== "completed" &&
    item.dueDate &&
    new Date(item.dueDate) < new Date()
  );
};
