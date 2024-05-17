import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const couponRouter: Router = Router();
couponRouter.get("/allevent", isLogin, controllers.couponController.getAllEventCoupon);
couponRouter.get("/all-coupon-event/:event_id", isLogin, controllers.couponController.getAllEventCouponByEventId);
couponRouter.get("/all", isLogin, controllers.couponController.getCouponsWithPagination);

couponRouter.post("/", isLogin, controllers.couponController.createCoupon);
couponRouter.patch("/:coupon_id", isLogin, controllers.couponController.updateCoupon);
couponRouter.delete("/:coupon_id", isLogin, controllers.couponController.deleteCoupon);
couponRouter.get("/:code", isLogin, controllers.couponController.getCouponByCode);
couponRouter.post("/ratio/", isLogin, controllers.couponController.createRatio);
couponRouter.patch("/ratio/update", isLogin, controllers.couponController.updateRatio);
couponRouter.delete("/ratio/delete", isLogin, controllers.couponController.deleteRatio);

// coupon_history
// couponRouter.post("/history/:coupon_id", isLogin, controllers.couponController.createCouponHistory);
couponRouter.get("/history", isLogin, controllers.couponController.getCouponHistoryByUserId);
couponRouter.get("/all-history", isLogin, controllers.couponController.getAllCouponHistory);
couponRouter.post("/owner/", isLogin, controllers.couponController.createCouponOwner);
couponRouter.post("/good-luck/", isLogin, controllers.couponController.createHistoryForGoodLuckNextTime);

couponRouter.get("/route/:coupon_id", isLogin, controllers.couponController.getCouponById);
couponRouter.get("/spin-history/:event_id", isLogin, controllers.couponController.getHistorySpinOfUserForAEvent);
couponRouter.get("/spin/voucher", isLogin, controllers.couponController.getVoucherBySpin);
export default couponRouter;
