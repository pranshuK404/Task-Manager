import { asyncHandler } from "../../utils/asyncHandler.js";
import {User} from "../../models/user.model.js";
import {ApiError} from "../../utils/ApiError.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import cryptoTokenUtility from "../../utils/cryptoToken.js";
import sendMail from "../../utils/sendMail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;

  //checking if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  //---CREATE USER

  const { rawToken, hashedToken, tokenExpiry } =
    cryptoTokenUtility.generateToken();
  const user = await User.create({
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    fullname,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: tokenExpiry,
  });

  const createdUser = user.toJSON(); //converts a database/model object into a plain JavaScript object.

  console.log(`User registered: ${createdUser.email}`);

  //---creating and sending verification email to client---
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;

  try {
    await sendMail(createdUser.email, verificationLink);
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully, Please verify your email",
      ),
    );
});
