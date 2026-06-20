import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import {ApiError} from "../../utils/ApiError.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!password || !token.trim()) {
    throw new ApiError(
      401,
      "either reset token or new password have been not sent",
    );
  }
  const hashedToken = cryptoTokenUtility.hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }
  user.password = password;

  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;

  user.refreshToken = null;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successful, login with your new password",
      ),
    );
});
