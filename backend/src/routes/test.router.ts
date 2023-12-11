import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const testRouter: Router = Router();

testRouter.get("/:test_id", isLogin, controllers.testController.getTestByTestId); //
testRouter.post("/history", isLogin, controllers.testController.createTestHistory); //
testRouter.get("/history/:test_id", isLogin, controllers.testController.getTestHistory); //

export default testRouter;
