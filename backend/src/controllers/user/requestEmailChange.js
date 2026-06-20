import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import sendMail  from "../../utils/sendMail.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";

export const requestEmailChange = asyncHandler(async (req, res) => {
  const currentEmail = req.user.email;
  const { password, email } = req.body;

  if (!password || !email || email === currentEmail) {
    throw new ApiError(400, "Please provide a different email and password");
  }

  const user = await User.findById(req.user._id).select("+password");

  //---PASSWORD MATCHING
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtility.generateToken();

  user.pendingEmail = email;
  user.emailVerificationToken = hashedToken;
  user.emailVerificationTokenExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  const verificationLink = `${process.env.CLIENT_URL}/user/me/change-email/verify?token=${rawToken}`;

  try {
    await sendMail(email, verificationLink);
  } catch (error) {
    user.pendingEmail = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    await user.save();

    throw new ApiError(500, "Email could not be sent");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Verification email sent to new email address"),
    );
});
