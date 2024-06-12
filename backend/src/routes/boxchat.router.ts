import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const boxchatRouter: Router = Router();

boxchatRouter.post("/", isLogin, controllers.boxChatController.submitQuestion); //
boxchatRouter.post("/check", isLogin, controllers.boxChatController.checkValidateComment); //
export default boxchatRouter;
