import { body } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 30 })
    .withMessage("Title must be between 5 and 30 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("taskType")
    .optional()
    .isIn(["personal", "collaborative"])
    .withMessage("Invalid task type"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];
