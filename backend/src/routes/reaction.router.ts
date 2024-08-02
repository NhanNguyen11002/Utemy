import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const reactionRouter: Router = Router();
reactionRouter.post("/like/", isLogin, controllers.reactionController.createLike);
reactionRouter.delete("/like/", isLogin, controllers.reactionController.deleteLike);
reactionRouter.post("/dislike/", isLogin, controllers.reactionController.createDislike);
reactionRouter.delete("/dislike/", controllers.reactionController.deleteDislike);
reactionRouter.get("/dislike", controllers.reactionController.checkDislikeExist);
reactionRouter.get("/like", controllers.reactionController.checkLikeExist);
export default reactionRouter;
