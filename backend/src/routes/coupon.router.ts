import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const couponRouter: Router = Router();

couponRouter.get("/", isLogin, controllers.couponController.getAllCoupon);
couponRouter.post("/", isLogin, controllers.couponController.createCoupon);
couponRouter.patch("/:coupon_id", isLogin, controllers.couponController.updateCoupon);
couponRouter.delete("/:coupon_id", isLogin, controllers.couponController.deleteCoupon);
couponRouter.get("/:code", isLogin, controllers.couponController.getCouponByCode);

// coupon_history
couponRouter.post("/history/:coupon_id", isLogin, controllers.couponController.createCouponHistory);
couponRouter.get("/history", isLogin, controllers.couponController.getCouponHistoryByUserId);
couponRouter.get("/all-history", isLogin, controllers.couponController.getAllCouponHistory);

export default couponRouter;
