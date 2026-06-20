import { asyncHandler } from "../../utils/asyncHandler.js";
import { SubTask } from "../../models/subTask.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { syncTaskState } from "../../utils/task/syncTaskState.js";
import { isOverDue } from "../../utils/task/isOverDue.js";

export const updateSubTaskStatus = asyncHandler(async (req, res) => {
  const subTaskId = req.params?.subTaskId;
  const userId = req.user?._id;
  const { status } = req.body;

  const subtask = await SubTask.findOne({
    _id: subTaskId,
    $or: [{ createdBy: userId }, { assignedTo: userId }],
  });

  if (!subtask) {
    throw new ApiError(404, "You don't have permission to update it");
  }

  if (subtask.status === status) {
    throw new ApiError(400, "Subtask already has this status");
  }

  subtask.status = status;

  const updatedSubtask = await subtask.save();

  await syncTaskState(subtask.task);

  

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedSubtask.toJSON(),
        "Subtask status updated successfully",
      ),
    );
});
