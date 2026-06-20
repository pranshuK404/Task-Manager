import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//---IMPORT VALIDATORS---
import {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
  getAllTasksValidator,
} from "../validators/task/0index.js";

//---IMPORT SUBTASK VALIDATOR
import { createSubTaskValidator , getTaskSubTasksValidator } from "../validators/subTask/0index.js";


//---IMPORT CONTROLLERS---

import {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  convertToCollaborative,
} from "../controllers/task/0index.js";

//---IMPORT SUBTASK CONTROLLERS---
import { createSubTask , getTaskSubTasks } from "../controllers/subTask/0index.js";

//---MOUNTING ROUTES---

const router = Router();

router.post("/", verifyJWT, createTaskValidator, validate, createTask);
router.get("/", verifyJWT,getAllTasksValidator, validate, getAllTasks);
router.get("/:taskId", verifyJWT, getTask);
router.patch("/:taskId", verifyJWT, updateTaskValidator, validate, updateTask);
router.delete("/:taskId", verifyJWT, deleteTask);
router.patch(
  "/:taskId/status",
  verifyJWT,
  updateTaskStatusValidator,
  validate,
  updateTaskStatus,
);
router.patch("/:taskId/convert", verifyJWT, convertToCollaborative);

//---MOUNTING SUBTASK ROUTES---
router.post("/:taskId/subtask", verifyJWT, createSubTaskValidator, validate, createSubTask);
router.get("/:taskId/subtask", verifyJWT,getTaskSubTasksValidator, validate ,getTaskSubTasks);

export default router;
