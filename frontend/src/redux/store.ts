import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth.slice";
import userSlice from "./slices/user.slice";
import sectionSlice from "./slices/section.slice";
import courseSlice from "./slices/course.slice";
import feedbackSlice from "./slices/feedback.slice";
import categorySlice from "./slices/category.slice";
import ratingSlice from "./slices/rating.slice";
import cartSlice from "./slices/cart.slice";
import invoiceSlice from "./slices/invoice.slice";
import vnpaySlice from "./slices/vnpay.slice";
import componentSlice from "./slices/component.slice";
import statisticSlice from "./slices/statistic.slice";
import quizSlice from "./slices/quiz.slice";
import lectureSlice from "./slices/lecture.slice";
import testSlice from "./slices/test.slice";
import approvalSlice from "./slices/approval.slice";
import decisionSlice from "./slices/decision.slice";
import reportSlice from "./slices/report.slice";
import couponSlice from "./slices/coupon.slice";
import eventSlice from "./slices/event.slice";
import progressSlice from "./slices/progress.slice";
import reactionSlice from "./slices/reaction.slice";
import commentSlice from "./slices/comment.slice";
import replyCommentSlice from "./slices/replycomment.slice";
import certifierSlice from "./slices/certifier.slice";
import blogSlice from "./slices/blog.slice";
import boxchatSlice from "./slices/boxchat.slice";
// import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
// import { composeWithDevTools } from "redux-devtools-extension";

const store = configureStore({
    reducer: {
        authSlice: authSlice,
        userSlice: userSlice,
        sectionSlice: sectionSlice,
        courseSlice: courseSlice,
        feedbackSlice: feedbackSlice,
        categorySlice: categorySlice,
        ratingSlice: ratingSlice,
        cartSlice: cartSlice,
        invoiceSlice,
        vnpaySlice,
        componentSlice,
        statisticSlice,
        quizSlice,
        lectureSlice,
        testSlice,
        approvalSlice,
        decisionSlice,
        reportSlice,
        couponSlice,
        eventSlice,
        progressSlice,
        reactionSlice,
        commentSlice,
        replyCommentSlice,
        certifierSlice,
        blogSlice,
        boxchatSlice,
        // fileStorageSlice: fileStorageSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
