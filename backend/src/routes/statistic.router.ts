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

export default statRouter;
