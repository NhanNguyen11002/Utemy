import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadEvidence } from "../middlewares/multer";

const decisionRouter: Router = Router();

decisionRouter.post("/", isLogin, controllers.decisionController.createDecision); //
decisionRouter.get("/course/:course_id", isLogin, controllers.decisionController.getDecisionsByCourseId);
decisionRouter.post("/evidence", uploadEvidence);

export default decisionRouter;
