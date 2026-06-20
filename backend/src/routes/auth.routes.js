import {Router} from "express"
import validate from "../middlewares/validate.middleware.js"
import {verifyJWT} from "../middlewares/authenticate.middleware.js"


//--IMPORTING VALIDATION RULES
import {registerValidationRules, loginValidationRules, verifyEmailValidationRules, resendEmailValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules, changePasswordValidationRules} from "../validators/auth/0index.js"

//----IMPORTING CONTROLLERS----
import {registerUser, loginUser, logoutUser, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, changePassword, refreshAccessToken} from "../controllers/auth/0index.js"


//---MOUNTING ROUTES----
const router = Router();

router.post("/register", registerValidationRules, validate, registerUser)
router.post("/login", loginValidationRules, validate, loginUser)
router.post("/verify-email", verifyEmailValidationRules, validate, verifyEmail)
router.post("/resend-email", resendEmailValidationRules, validate, resendVerificationEmail)
router.post("/forgot-password", forgotPasswordValidationRules, validate, forgotPassword)
router.post("/reset-password", resetPasswordValidationRules, validate, resetPassword)
router.post("/refresh-token", refreshAccessToken)     

//----PROTECTED ROUTES
router.post("/logout", verifyJWT, logoutUser)
router.post("/change-password",verifyJWT, changePasswordValidationRules, validate, changePassword)

export default router