import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, fullname } = req.body;
  const user = req.user;

  if (!username && !fullname) {
    throw new ApiError(400, "Please provide username or fullname to update");
  }

  let isUpdated = false;
  //  Username update
  if (username && username !== user.username) {
    user.username = username;
    isUpdated = true;
  }

  // Fullname update
  if (fullname && fullname !== user.fullname) {
    user.fullname = fullname;
    isUpdated = true;
  }

  if (!isUpdated) {
    throw new ApiError(400, "NO change detected!");
  }

  await user.save();
  const updatedUser = user.toJSON();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
