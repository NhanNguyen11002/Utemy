import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const cartRouter: Router = Router();

cartRouter.post("/", isLogin, controllers.cartController.addCourseToCart);
cartRouter.patch("/:cart_detail_id", isLogin, controllers.cartController.changeSaveForLater);
cartRouter.delete("/:cart_detail_id", isLogin, controllers.cartController.removeCourseFromCart);
cartRouter.get("/", isLogin, controllers.cartController.getAllCart);

export default cartRouter;
