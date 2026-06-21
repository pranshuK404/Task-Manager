import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";
import { generateAccessAndRefreshTokens } from "../../utils/generateAccessRefreshTokens.js";
import { cookieOptions } from "../../utils/constants.js";

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token?.trim();

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }
  const hashedUserToken = cryptoTokenUtility.hashToken(token);
  const user = await User.findOne({
    emailVerificationToken: hashedUserToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token ");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Email already verified");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);
  await user.save();

  const verifiedUser = user.toJSON();

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(true, verifiedUser, "Email verified successfully"));
});
