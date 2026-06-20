import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//--IMPORTING VALIDATION RULES
import {
  updateSubTaskValidator,
  updateSubTaskStatusValidator,
  assignSubTaskValidator,
} from "../validators/subTask/0index.js";

//---IMPORTING CONTROLLERS----

import {
  getSubTask,
  updateSubTask,
  deleteSubTask,
  updateSubTaskStatus,
  assignSubTask,
} from "../controllers/subTask/0index.js";

//---MOUNTING ROUTES----

const router = Router();

router.get("/:subtaskId", verifyJWT, getSubTask);
router.patch(
  "/:subtaskId",
  verifyJWT,
  updateSubTaskValidator,
  validate,
  updateSubTask,
);
router.delete("/:subtaskId", verifyJWT, deleteSubTask);
router.patch(
  "/:subtaskId/status",
  verifyJWT,
  updateSubTaskStatusValidator,
  validate,
  updateSubTaskStatus,
);
router.patch(
  "/:subtaskId/assign",
  verifyJWT,
  assignSubTaskValidator,
  validate,
  assignSubTask,
);

export default router;
