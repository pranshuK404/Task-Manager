import { body } from "express-validator";

export const changePasswordValidationRules = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("CurrentPassword is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
]

