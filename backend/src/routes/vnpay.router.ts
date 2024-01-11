import { Router } from "express";
import controllers from "../controllers/index";

const vnpayRouter: Router = Router();

vnpayRouter.post("/", controllers.vnpayController.vnpayIpn); //
vnpayRouter.post("/create_payment_url", controllers.vnpayController.createPaymentUrl);

export default vnpayRouter;
