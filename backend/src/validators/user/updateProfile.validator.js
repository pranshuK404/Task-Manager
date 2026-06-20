import { body } from "express-validator";

export const updateProfileValidator = [

  body("username")
    .optional()
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage(
      "Username must be between 3 and 30 characters"
    )
    .matches(/^[a-z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores"
    ),

  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Full name must be between 2 and 50 characters"
    ),
];