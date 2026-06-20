import { asyncHandler } from "../../utils/asyncHandler.js";
import {User} from "../../models/user.model.js";
import {ApiError} from "../../utils/ApiError.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";
import sendMail from "../../utils/sendMail.js";

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "If account exists, verification email sent.");
  }
  if (user.isVerified) {
    throw new ApiError(400, "If account exists, verification email sent.");
  }

  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtility.generateToken(15);

  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  //----Send verification email with the raw token----

  const verificationLink = `${process.env.CLIENT_URL}/auth/verify-email?token=${rawToken}`;

  try {
    await sendMail(user.email, verificationLink);
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Verification email sent successfully"));
});
