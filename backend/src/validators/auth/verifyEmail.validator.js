import { query } from "express-validator";

export const verifyEmailValidationRules = [
  query("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required"),
];