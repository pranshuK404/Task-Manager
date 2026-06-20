import { body } from "express-validator";

export const requestEmailChangeValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
   .trim()
   .notEmpty()
   .withMessage("Password is required"),
];
