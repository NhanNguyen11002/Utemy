import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadVideo } from "../middlewares/multer";
import { isAuthor } from "../middlewares/isAuthor";

const lectureRouter: Router = Router();

lectureRouter.post("/", isLogin, uploadVideo, controllers.lectureController.createLecture); //
lectureRouter.patch("/", isLogin, uploadVideo, isAuthor, controllers.lectureController.updateLecture);
lectureRouter.delete("/:lecture_id", isLogin, isAuthor, controllers.lectureController.deleteLecture);
lectureRouter.get("/:lecture_id", isLogin, controllers.lectureController.getLectureById);

export default lectureRouter;
