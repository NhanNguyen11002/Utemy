import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadImageBlog } from "../middlewares/multer";

const blogRouter: Router = Router();

blogRouter.post("/", isLogin, uploadImageBlog, controllers.blogController.createBlog); //
blogRouter.patch("/", isLogin, uploadImageBlog, controllers.blogController.updateBlog); //
blogRouter.delete("/:slug", isLogin, controllers.blogController.deleteBlog); //
blogRouter.get("/all", isLogin, controllers.blogController.getBlogsWithPagination); //
blogRouter.get("/full", controllers.blogController.getBlogs); //
blogRouter.get("/top10like", controllers.blogController.top10Like); //
blogRouter.get("/top10view", controllers.blogController.top10View); //
blogRouter.get("/search", controllers.blogController.searchBlogUserWithPagination); //
blogRouter.get("/newest", controllers.blogController.getNewestBlogWithPagination); //
blogRouter.get("/related/:slug", controllers.blogController.top5RelatedBySlug); //
blogRouter.post("/react", isLogin, controllers.blogController.reactBlog); //
blogRouter.post("/view/:slug", controllers.blogController.increaseViewBlog); //
blogRouter.get("/react/:slug", isLogin, controllers.blogController.getUserReactBySlug); //
blogRouter.patch("/:slug", isLogin, controllers.blogController.togglePublishedBlog); //
blogRouter.get("/:slug", controllers.blogController.getBlog); //

export default blogRouter;
