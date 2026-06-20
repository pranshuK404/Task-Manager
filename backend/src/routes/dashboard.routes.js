import {Router} from "express"
// import validate from "../middlewares/validate.middleware.js"
import {verifyJWT} from "../middlewares/authenticate.middleware.js"

//----IMPORTING CONTROLLERS----
import {getDashboard} from "../controllers/dashboard/getDashboard.js"

const router = Router();

router.get("/", verifyJWT, getDashboard)

export default router




