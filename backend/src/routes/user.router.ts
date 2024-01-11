import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { uploadAvatar } from "../middlewares/multer";

const userRouter: Router = Router();

// 8. Get me
userRouter.get("/profile", isLogin, controllers.userController.getProfile);

userRouter.get("/all", isLogin, controllers.userController.getAllUsers);
// 9. update profile
userRouter.patch("/update-profile", isLogin, controllers.userController.updateProfile);

// 10. Change Avatar
userRouter.post("/avatar", isLogin, uploadAvatar, controllers.userController.changeAvatar); //

userRouter.post("/", isLogin, controllers.userController.createNewUser);
// 11. Get author profile
userRouter.get("/:id", controllers.userController.getAuthorProfile);

userRouter.patch("/:id", isLogin, controllers.userController.editUser);

userRouter.delete("/:id", isLogin, controllers.userController.deleteUser);

userRouter.put("/:id", isLogin, controllers.userController.activeUser);

export default userRouter;
