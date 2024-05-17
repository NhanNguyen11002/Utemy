import express, { Application } from "express";
import configs from "./src/configs";
import cors from "cors";
import routes from "./src/routes";
// import { text } from "stream/consumers";

const app: Application = express();
const port: number = configs.general.PORT;

const corsOptions = {
    "Access-Control-Allow-Origin": "*",
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/auth", routes.authRouter);
app.use("/api/user", routes.userRouter);
app.use("/api/section", routes.sectionRouter);
app.use("/api/course", routes.courseRouter);
app.use("/api/category", routes.categoryRouter);
app.use("/api/feedback", routes.feedbackRouter);
app.use("/api/rating", routes.ratingRouter);
app.use("/api/cart", routes.cartRouter);
app.use("/api/invoice", routes.invoiceRouter);
app.use("/api/stat", routes.statRouter);
app.use("/api/quiz", routes.quizRouter);
app.use("/api/lecture", routes.lectureRouter);
app.use("/api/test", routes.testRouter);
app.use("/api/coupon", routes.couponRouter);
app.use("/api/event", routes.eventRouter);
app.use("/api/approval", routes.approvalRouter);
app.use("/api/decision", routes.decisionRouter);
app.use("/api/report", routes.reportRouter);
app.use("/api/progress", routes.progressRouter);
app.use("/IPN", routes.vnpayRouter);
app.use("/api/comment", routes.commentRouter);
app.use("/api/reply", routes.replyCommentRouter);
app.use("/api/reaction", routes.reactionRouter);
app.use("/api/certifier", routes.certifierRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
