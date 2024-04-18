import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadEvidence } from "../middlewares/multer";

const progressRouter: Router = Router();

progressRouter.post("/", isLogin, controllers.progressController.updateProgress); //

export default progressRouter;
