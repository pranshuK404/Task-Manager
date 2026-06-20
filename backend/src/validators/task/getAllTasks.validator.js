import {query} from "express-validator";

export const getAllTasksValidator = [
  query("status")
    .optional()
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status must be one of: pending, in_progress, completed"),
  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),
  query("taskType")
    .optional()
    .isIn(["personal", "collaborative"])
    .withMessage("Task type must be one of: personal, collaborative"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "dueDate ,subtasksCount"])
    .withMessage("Sort by must be one of: title, created_at, due_date ,subtasksCount"),
];