import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const quizRouter: Router = Router();

quizRouter.post("/", isLogin, controllers.quizController.createQuiz); //
quizRouter.post("/group", isLogin, controllers.quizController.createQuizGroup);
quizRouter.patch("/:quiz_id", isLogin, controllers.quizController.updateQuiz); //
quizRouter.patch("/group/:quiz_group_id", isLogin, controllers.quizController.updateQuizGroup);
quizRouter.delete("/:quiz_id", isLogin, controllers.quizController.deleteQuiz); //
quizRouter.delete("/group/:quiz_group_id", isLogin, controllers.quizController.deleteQuizGroup);
quizRouter.get("/group", isLogin, controllers.quizController.getAllQuizGroup);
quizRouter.get("/:quiz_group_id", isLogin, controllers.quizController.getAllQuizByGroupId); //

export default quizRouter;
