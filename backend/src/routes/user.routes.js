import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//--IMPORTING VALIDATION RULES
import {
  requestEmailChangeValidator,
  updateProfileValidator,
  verifyEmailChangeValidator
} from "../validators/user/0index.js";

//----IMPORTING CONTROLLERS----
import {
  requestEmailChange,
  verifyEmailChange,
  updateUserProfile,
  getCurrentUser,
} from "../controllers/user/0index.js";

//---MOUNTING ROUTES----

const router = Router();

router.get("/me", verifyJWT, getCurrentUser)
router.patch("/me/profile", verifyJWT, updateProfileValidator, validate, updateUserProfile)
router.post("/me/change-email", verifyJWT, requestEmailChangeValidator, validate, requestEmailChange)
router.get("/me/change-email/verify",verifyEmailChangeValidator,validate, verifyEmailChange)


export default router;