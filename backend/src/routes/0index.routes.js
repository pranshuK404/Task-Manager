import {Router} from "express";


//--IMPORTING ROUTES--
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import taskRoutes from "./task.routes.js"
import subTaskRoutes from "./subTask.routes.js"
import dashboardRoutes from "./dashboard.routes.js"

//--MOUNTING ROUTES--
const router = Router();

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/task", taskRoutes)
router.use("/subtask", subTaskRoutes)
router.use("/dashboard", dashboardRoutes)


export default router
