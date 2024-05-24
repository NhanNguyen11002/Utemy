import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const reactionCommentBlogRouter: Router = Router();
reactionCommentBlogRouter.post("/", isLogin, controllers.reactionCommentBlogController.createReactionCommentBlog);
reactionCommentBlogRouter.delete(
    "/:reaction_id",
    isLogin,
    controllers.reactionCommentBlogController.deleteReactionCommentBlog,
);
reactionCommentBlogRouter.get(
    "/all_quantity_reaction",
    controllers.reactionCommentBlogController.getTotalReactionsForAllComments,
);
reactionCommentBlogRouter.get("/:comment_id", controllers.reactionCommentBlogController.getTotalReactionsByCommentId);
export default reactionCommentBlogRouter;
