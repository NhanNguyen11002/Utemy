import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const invoiceRouter: Router = Router();

invoiceRouter.post("/", isLogin, controllers.invoiceController.createInvoice); //
invoiceRouter.get("/all", isLogin, controllers.invoiceController.getAllInvoices); //
invoiceRouter.get("/", isLogin, controllers.invoiceController.getNowInvoice); //
invoiceRouter.get("/:invoice_id", isLogin, controllers.invoiceController.getInvoiceById); //
export default invoiceRouter;
