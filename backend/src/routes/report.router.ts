import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadEvidence } from "../middlewares/multer";

const reportRouter: Router = Router();

reportRouter.post("/", isLogin, controllers.reportController.createReport); //
reportRouter.get("/course/:course_id", isLogin, controllers.reportController.getReportByCourseId);
reportRouter.get("/", isLogin, controllers.reportController.getAllReportWithPagination);
reportRouter.patch("/handle/:report_id", isLogin, controllers.reportController.handleReport);

export default reportRouter;
