import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const statRouter: Router = Router();

statRouter.get("/category-course", isLogin, controllers.statisticController.categoryCourseCount);
statRouter.get("/category-enrolled", isLogin, controllers.statisticController.categoryEnrolledCount);
statRouter.get("/category-money", isLogin, controllers.statisticController.categoryMoneyCount);
statRouter.get("/course", isLogin, controllers.statisticController.courseCount);
statRouter.get("/total-invoice", isLogin, controllers.statisticController.invoiceCount);
statRouter.get("/money", isLogin, controllers.statisticController.moneyCalculation);
statRouter.get("/total-user", isLogin, controllers.statisticController.userCount);
statRouter.get("/money-by-month/:year", isLogin, controllers.statisticController.moneyByMonth);
statRouter.get("/rating-percent", isLogin, controllers.statisticController.ratingPercent);
statRouter.get("/desc/enrolled-courses", isLogin, controllers.statisticController.statCourseForAdminByEnrolled);
statRouter.get("/desc/avgrating-courses", isLogin, controllers.statisticController.statCourseForAdminByAvgRating);
statRouter.get("/desc/income-courses", isLogin, controllers.statisticController.statCourseForAdminByIncome);
statRouter.get("/desc/report-courses", isLogin, controllers.statisticController.statCourseForAdminByReport);

statRouter.get("/course-owner", isLogin, controllers.statisticController.courseCountByOwnerCourse);
statRouter.get("/course-top5-enrolled", isLogin, controllers.statisticController.getTop5EnrolledCourse);
statRouter.get("/course-top5-rate", isLogin, controllers.statisticController.getTop5RateCourse);
statRouter.get("/income", isLogin, controllers.statisticController.moneyCalculationByOwner);
statRouter.get("/income-by-month/:year", isLogin, controllers.statisticController.moneyByMonthByOwner);
statRouter.get("/income-by-course", isLogin, controllers.statisticController.moneyByCourseByOwner);
statRouter.get("/total-enrolled-by-owner", isLogin, controllers.statisticController.userEnrolledCountByOwner);
statRouter.get("/enrolled-stat-by-time", isLogin, controllers.statisticController.studentsRegisteredByTime);
statRouter.get("/enrolled-stat-by-year/:year", isLogin, controllers.statisticController.studentsRegisteredByYear);
statRouter.get("/income-sale-course", isLogin, controllers.statisticController.moneySaleCourseCalculationByOwner);
statRouter.get("/income-origin-course", isLogin, controllers.statisticController.moneyOriginCourseByOwner);
statRouter.get("/total-pass-unpass", isLogin, controllers.statisticController.totalPassOrUnpassCourseOfOwner);
statRouter.get("/avg-rate-all-course", isLogin, controllers.statisticController.avgRateAllCoursesByOwner);
statRouter.get("/rating-percent-by-owner", isLogin, controllers.statisticController.ratingPercentByOwner);
statRouter.get("/total-turn-rating", isLogin, controllers.statisticController.totalTurnRatingByOwner);

export default statRouter;
