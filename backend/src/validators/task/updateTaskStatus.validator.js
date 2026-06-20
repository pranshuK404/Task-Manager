import {body} from "express-validator";

export const updateTaskStatusValidator = [
  body("status")
    .exists()
    .withMessage("Status is required")
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status must be one of: pending, in_progress, completed"),
];
