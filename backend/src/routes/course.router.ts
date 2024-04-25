import { Router } from "express";
import controllers from "../controllers/index";
import { isLogin } from "../middlewares/isLogin";
import { isAuthor } from "../middlewares/isAuthor";
import { uploadAvatar, uploadMixFiles, uploadThumbnail, uploadTrailer, uploadVideo } from "../middlewares/multer";

const courseRouter: Router = Router();
// Get all sales courses
courseRouter.get("/all-sales", controllers.courseController.getAllSalesCourses);
// Get top 10 sales courses
courseRouter.get("/top10-sales", controllers.courseController.getTop10SalesCourses);
//13. Get right of course
courseRouter.get("/right/:course_id", isLogin, controllers.courseController.getRightOfCourse);

//14. Create course
courseRouter.post("/", isLogin, uploadMixFiles, controllers.courseController.createCourse);

courseRouter.patch("/approve/:course_id", isLogin, controllers.courseController.approveCourse);
courseRouter.patch("/restrict/:course_id", isLogin, controllers.courseController.restrictCourse);

//19. Get course detail by id

//15. Edit course
courseRouter.patch("/", isLogin, uploadMixFiles, isAuthor, controllers.courseController.editCourse);

courseRouter.patch("/target", isLogin, isAuthor, controllers.courseController.updateTargetCourse);

//16. Delete course
courseRouter.delete("/:course_id", isLogin, isAuthor, controllers.courseController.deleteCourse);

//17. Buy course
courseRouter.post("/promotion", isLogin, isAuthor, controllers.courseController.addPromotion);
courseRouter.delete("/promotion/:course_id", isLogin, isAuthor, controllers.courseController.stopPromotion);
//18. Rating course

//20. Get list of rating course
courseRouter.get("/:slug/rating", controllers.courseController.getListRatingOfCourse);

courseRouter.get("/:slug/progress", isLogin, controllers.courseController.getProgressByCourseSlug);

courseRouter.get("/percent/:slug", controllers.courseController.getRatingPercentOfCourse);

//21. Get user's rating of course

//22. Get top 10 hightest rate courses
courseRouter.get("/top10", controllers.courseController.getTop10RateCourse);

courseRouter.get("/top-enrolled", controllers.courseController.getTop10EnrolledCourse);

courseRouter.get("/enrolled-id", isLogin, controllers.courseController.getAllEnrolled);
//23. Search my course
courseRouter.get("/my", isLogin, controllers.courseController.searchMyCourse);
courseRouter.get("/enrolled", isLogin, controllers.courseController.searchMyEnrolledCourse);
courseRouter.get("/detail/:course_id", isLogin, isAuthor, controllers.courseController.getCourseDetailById);
courseRouter.get("/all", controllers.courseController.getAllCourse);
courseRouter.post("/thumbnail", isLogin, uploadAvatar, controllers.courseController.changeThumbnail);
courseRouter.get("/:slug", controllers.courseController.getCourseDetail);
courseRouter.get("/trial/:slug", controllers.courseController.getCourseDetailForTrialLesson);
export default courseRouter;
