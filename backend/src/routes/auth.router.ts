import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar } from "../middlewares/multer";

const authRouter: Router = Router();

authRouter.post("/mail/verify", controllers.authController.resendVerifyEmail);
authRouter.post("/mail/forgot", controllers.authController.resendForgotPasswordEmail);
authRouter.post("/login", controllers.authController.login); //
authRouter.post("/signup", controllers.authController.signup); //
authRouter.get("/refresh", controllers.authController.refreshAccesToken); //
authRouter.get("/verify/:token", controllers.authController.verifyEmail); //
authRouter.post("/forgot-password", controllers.authController.forgotPassword); //
authRouter.patch("/reset-password", controllers.authController.resetPassword); //
authRouter.patch("/password", isLogin, controllers.authController.changePassword); //
authRouter.get("/me", isLogin, controllers.authController.getMe); //

export default authRouter;
