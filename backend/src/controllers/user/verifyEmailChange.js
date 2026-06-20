import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";

export const verifyEmailChange = asyncHandler(async (req, res) => {
  const token = req.query?.token?.trim();

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const hashedUserToken = cryptoTokenUtility.hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedUserToken,

    emailVerificationTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  if (!user.pendingEmail) {
    throw new ApiError(400, "No pending email change request found");
  }

  const existingUser = await User.findOne({
    email: user.pendingEmail,
  });

  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  user.email = user.pendingEmail;

  user.pendingEmail = undefined;

  user.emailVerificationToken = undefined;

  user.emailVerificationTokenExpiry = undefined;

  user.isVerified = true;

  user.refreshToken = null;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email updated successfully"));
});
