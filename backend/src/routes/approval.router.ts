import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const approvalRouter: Router = Router();

approvalRouter.post("/", isLogin, controllers.approvalController.createApproval); //
approvalRouter.get("/", isLogin, controllers.approvalController.getApprovalsWithPagination);

export default approvalRouter;
