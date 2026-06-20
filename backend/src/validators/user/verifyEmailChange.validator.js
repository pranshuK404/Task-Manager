import { query } from "express-validator";

export const verifyEmailChangeValidator = [
  query("token")
    .trim()
    .notEmpty()
    .withMessage("Token is required"),
];