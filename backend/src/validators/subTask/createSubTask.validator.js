import { body } from "express-validator";

export const createSubTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Sub-task title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("assignedTo")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address for assignment"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid due date"),
];
