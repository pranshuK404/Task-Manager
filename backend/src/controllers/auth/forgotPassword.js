import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import {ApiError} from "../../utils/ApiError.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";
import sendMail from "../../utils/sendMail.js";

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "If this email exists, a reset link has been sent");
  }
  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtility.generateToken(10);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/auth/reset-password?token=${rawToken}`;
  try {
    await sendMail(user.email, resetURL);
  } catch (error) {
    // If email sending fails, clear the reset token and expiry from the user document
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset Email sent successfully"));
});
