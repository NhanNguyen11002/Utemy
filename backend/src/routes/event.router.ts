import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";

const eventRouter: Router = Router();

eventRouter.get("/allevent", isLogin, controllers.eventController.getAllEvents);
eventRouter.get("/all", isLogin, controllers.eventController.getEventsWithPagination);
eventRouter.post("/", isLogin, controllers.eventController.createEvent);
eventRouter.patch("/:event_id", isLogin, controllers.eventController.updateEvent);
eventRouter.delete("/:event_id", isLogin, controllers.eventController.deleteEvent);
eventRouter.get("/:event_id", isLogin, controllers.eventController.getEventById);
eventRouter.get("/is/active", isLogin, controllers.eventController.getActiveEvent);
export default eventRouter;
