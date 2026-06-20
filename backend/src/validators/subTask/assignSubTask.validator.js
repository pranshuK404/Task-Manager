import { body } from "express-validator";

export const assignSubTaskValidator = [
  body("assignedTo")
    .trim()
    .notEmpty()
    .withMessage("Assignee email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];
