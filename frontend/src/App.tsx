import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { authActions } from "./redux/slices";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Verify from "./pages/VerifyEmail";
import CheckMail from "./pages/CheckMail";
import ChangePassword from "./pages/ChangePassword";
import MyCourses from "./pages/MyCourse";
import CreateCourse from "./pages/CreateCourse";
import MyEnrolledCourse from "./pages/MyEnrolledCourse";
import CourseDetail from "./pages/CourseDetail";
import Cart from "./pages/Cart";
import EditCourse from "./pages/EditCourse";
import NotFound from "./pages/NotFound";
import AllCourses from "./pages/AllCourse";
import WatchVideo from "./pages/WatchVideo";
import Checkout from "./pages/CheckOut";
import VnPayReturn from "./pages/VnPayReturn";
import Dashboard from "./pages/Admin/Dashboard";
import CategoryAdmin from "./pages/Admin/Category";
import FeedbackAdmin from "./pages/Admin/Feedback";
import UserAdmin from "./pages/Admin/User";
import ProfileAdmin from "./pages/Admin/Profile";
import MyProfile from "./pages/MyProfile";
import CreateUser from "./pages/Admin/CreateUser";
import UserProfile from "./pages/Admin/UserProfile";
import Quiz from "./pages/Quiz";
import ATestingComponent from "./pages/ATestingComponent";
import PrivateRoute from "./routes/PrivateRoutes";
import UserAppLayout from "./layout/userAppLayout";
import AdminRoute from "./routes/AdminRoutes";
import AuthorProfile from "./pages/AuthorProfile";
import AdminLayout from "./layout/adminAppLayout";
import Feedback from "./pages/Feedback";
import HistoryTransaction from "./pages/HistoryTransaction";
import UserWatchVideoLayout from "./layout/userWatchVideoLayout";
import UserAppLayoutWithNav from "./layout/userAppLayoutWithNav";
import LecturerAppLayout from "./layout/lecturerAppLayout";
function App() {
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            dispatch(authActions.getMe());
        }
    }, [dispatch]);
    return (
        <div className="App">
            <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                    <Routes>
                        <Route path="/admin/*" element={<AdminRoute />}>
                            <Route element={<AdminLayout />}>
                                <Route index element={<Dashboard />}></Route>
                                <Route path="profile" element={<ProfileAdmin />}></Route>
                                <Route path="category" element={<CategoryAdmin />}></Route>
                                <Route path="user" element={<UserAdmin />}></Route>
                                <Route path="user-profile/:id" element={<UserProfile />}></Route>
                                <Route path="user/create" element={<CreateUser />}></Route>
                                <Route path="feedback" element={<FeedbackAdmin />}></Route>
                                <Route path="*" element={<NotFound />}></Route>
                            </Route>
                        </Route>
                        <Route element={<UserAppLayout isLogin={isLogin} />}>
                            <Route path="login" element={<Login />}></Route>
                            <Route path="signup" element={<Signup />}></Route>
                            <Route path="forgot-password" element={<ForgotPassword />}></Route>
                            <Route path="reset-password/:token" element={<ResetPassword />}></Route>
                            <Route path="verify-email/:token" element={<Verify />}></Route>
                            <Route path="check-mail" element={<CheckMail />}></Route>
                            <Route path="all-courses" element={<AllCourses />}></Route>
                            <Route path="test" element={<ATestingComponent />}></Route>
                            <Route path="course-detail/:slug" element={<CourseDetail isLogin={isLogin} />}></Route>

                            <Route element={<PrivateRoute />}>
                                <Route path="change-password" element={<ChangePassword />}></Route>
                                <Route path="create-course" element={<CreateCourse />}></Route>
                                <Route path="cart" element={<Cart />}></Route>
                                <Route path="checkout" element={<Checkout />}></Route>
                                <Route path="checkout/vnpay_return" element={<VnPayReturn />}></Route>
                                <Route path="my-profile" element={<MyProfile />}></Route>
                                <Route path="my-feedback" element={<Feedback />}></Route>
                                <Route path="history-transaction" element={<HistoryTransaction />}></Route>
                                <Route path="quiz" element={<Quiz />}></Route>
                            </Route>
                            <Route path="*" element={<NotFound />}></Route>
                        </Route>
                        <Route path="/*" element={<UserAppLayoutWithNav isLogin={isLogin} />}>
                            <Route path="profile/:id" element={<AuthorProfile />}></Route>
                            <Route path="my-enrolled-courses" element={<MyEnrolledCourse />}></Route>
                            <Route index element={<HomePage />}></Route>
                        </Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="/lecturer" element={<LecturerAppLayout isLogin={isLogin} />}>
                                <Route path="test" element={<ATestingComponent />}></Route>
                                <Route index element={<MyCourses />}></Route>
                                <Route path="courses/edit/:course_id" element={<EditCourse />}></Route>
                                <Route path="course-detail/:slug" element={<CourseDetail isLogin={isLogin} />}></Route>
                                <Route path="quiz" element={<Quiz />}></Route>
                            </Route>
                        </Route>
                        <Route path="course-detail/:slug/watch" element={<UserWatchVideoLayout />}>
                            <Route index element={<WatchVideo />}></Route>
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
