import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadVideo } from "../middlewares/multer";
import { isAuthor } from "../middlewares/isAuthor";

const lessonRouter: Router = Router();

lessonRouter.post("/", isLogin, uploadVideo, controllers.lessonController.createLesson); //
lessonRouter.patch("/", isLogin, uploadVideo, isAuthor, controllers.lessonController.updateLesson);
lessonRouter.delete("/", isLogin, isAuthor, controllers.lessonController.deleteLesson);
lessonRouter.get("/:lesson_id", isLogin, controllers.lessonController.getLessonById);

export default lessonRouter;
