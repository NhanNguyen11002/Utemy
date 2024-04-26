import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const commentRouter: Router = Router();
commentRouter.post("/", isLogin, controllers.commentController.createComment);
commentRouter.patch("/:comment_id", isLogin, controllers.commentController.updateComment);
commentRouter.delete("/:comment_id", isLogin, controllers.commentController.deleteComment);
commentRouter.get("/all", controllers.commentController.getCommentsWithPagination);
commentRouter.get("/:lecture_id", controllers.commentController.getCommentsWithPaginationByLectureId);
export default commentRouter;