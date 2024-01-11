import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const ratingRouter: Router = Router();

ratingRouter.post("/", isLogin, controllers.ratingController.ratingCourse);
//19. Edit rating course
ratingRouter.patch("/", isLogin, controllers.ratingController.editRatingCourse);
// Delete rating course
ratingRouter.delete("/:rating_id", isLogin, controllers.ratingController.deleteRatingCourse);

ratingRouter.get("/:course_id", isLogin, controllers.ratingController.getUserRatingOfCourse);
export default ratingRouter;
