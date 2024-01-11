import { Router } from "express";
import controllers from "../controllers/index";
import { defaultMaxListeners } from "events";
import { isLogin } from "../middlewares/isLogin";
import { isAuthor } from "../middlewares/isAuthor";

const sectionRouter: Router = Router();

// 33. Add Section
sectionRouter.post("/", isLogin, isAuthor, controllers.sectionController.addSection);

// 34. Edit section
sectionRouter.patch("/", isLogin, isAuthor, controllers.sectionController.editSection);

// 35. Delete Section
sectionRouter.delete("/:section_id", isLogin, isAuthor, controllers.sectionController.deleteSection);

sectionRouter.get("/:course_id", isLogin, isAuthor, controllers.sectionController.getAllSectionByCourseId);

export default sectionRouter;
