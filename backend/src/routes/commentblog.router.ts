import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const commentBlogRouter: Router = Router();
commentBlogRouter.post("/", isLogin, controllers.commentBlogController.createCommentBlog);
commentBlogRouter.patch("/:commentblog_id", isLogin, controllers.commentBlogController.updateCommentBlog);
commentBlogRouter.delete("/:commentblog_id", isLogin, controllers.commentBlogController.deleteCommentBlog);
commentBlogRouter.get("/all", controllers.commentBlogController.getCommentBlogsWithPagination);
commentBlogRouter.get("/:blog_id", controllers.commentBlogController.getCommentBlogsWithPaginationByBlogId);
export default commentBlogRouter;
