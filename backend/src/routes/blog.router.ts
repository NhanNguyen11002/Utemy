import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadImageBlog } from "../middlewares/multer";

const blogRouter: Router = Router();

blogRouter.post("/", isLogin, uploadImageBlog, controllers.blogController.createBlog); //
blogRouter.patch("/", isLogin, uploadImageBlog, controllers.blogController.updateBlog); //
blogRouter.delete("/:slug", isLogin, controllers.blogController.deleteBlog); //
blogRouter.get("/all", controllers.blogController.getBlogsWithPagination); //
blogRouter.get("/full", controllers.blogController.getBlogs); //
blogRouter.get("/:slug", isLogin, controllers.blogController.getBlog); //
blogRouter.patch("/:slug", isLogin, controllers.blogController.togglePublishedBlog); //

export default blogRouter;
