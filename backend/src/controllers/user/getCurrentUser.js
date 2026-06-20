import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const currentUser = req.user.toJSON();
  return res
    .status(200)
    .json(new ApiResponse(200, currentUser, "User fetched successfully"));
});
