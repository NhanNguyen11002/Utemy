import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const replyCommentRouter: Router = Router();
replyCommentRouter.post("/", isLogin, controllers.replyCommentController.createReplyComment);
replyCommentRouter.patch("/:reply_id", isLogin, controllers.replyCommentController.updateReplyComment);
replyCommentRouter.delete("/:reply_id", isLogin, controllers.replyCommentController.deleteReplyComment);
replyCommentRouter.get("/all", controllers.replyCommentController.getReplyCommentsWithPagination);
export default replyCommentRouter;
