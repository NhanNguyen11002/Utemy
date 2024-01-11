import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar, uploadCategory } from "../middlewares/multer";

const categoryRouter: Router = Router();

categoryRouter.post("/", isLogin, uploadCategory, controllers.categoryController.createCategory); //
categoryRouter.patch("/", isLogin, uploadCategory, controllers.categoryController.updateCategory); //
categoryRouter.delete("/:category_id", isLogin, controllers.categoryController.deleteCategory); //
categoryRouter.get("/all", controllers.categoryController.getCategoriesWithPagination); //
categoryRouter.get("/full", controllers.categoryController.getCategories); //
categoryRouter.get("/top5", controllers.categoryController.get5Categories); //
categoryRouter.get("/:category_id", isLogin, controllers.categoryController.getCategory); //

export default categoryRouter;
