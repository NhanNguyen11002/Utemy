import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const feedbackRouter: Router = Router();

feedbackRouter.post("/", isLogin, controllers.feedbackController.createFeedback); //
feedbackRouter.get("/", isLogin, controllers.feedbackController.getAllFeedbacks);

export default feedbackRouter;
