import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const certifierRouter: Router = Router();

certifierRouter.post("/", isLogin, controllers.certifierController.sendCertifier); //

export default certifierRouter;
