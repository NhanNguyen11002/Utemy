import React from "react";
import {
    CartIcon,
    LogoutIcon,
    MyCourseIcon,
    AllcoursesIcon,
    MyEnrollCourseIcon,
    ChangePasswordIcon,
    UserIcon,
} from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { FaHistory, FaRegQuestionCircle } from "react-icons/fa";

const UserDropDown: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(authActions.logout());
        navigate("/");
    };

    const totalCourseInCart = useAppSelector((state) => state.cartSlice.totalCourseInCart);

    return (
        <>
            <Link to={"/cart"} className="w-full rounded-lg hover:bg-footer">
                <div className="flex justify-start indicator items-center px-4 py-4">
                    <span className="indicator-item badge badge-info text-white">{totalCourseInCart}</span>
                    <CartIcon />
                    <span className="ml-3 font-medium text-lg">Giỏ hàng</span>
                </div>
            </Link>
            <Link to={"/history-transaction"} className="w-full rounded-lg hover:bg-footer">
                <div className="flex justify-start indicator items-center px-4 py-4">
                    <FaHistory size={14} style={{ margin: "5px" }} />
                    <span className="ml-3 font-medium text-lg">Lịch sử mua hàng</span>
                </div>
            </Link>
            <Link to={"/my-profile"} className="w-full rounded-lg hover:bg-footer">
                <div className="flex justify-start items-center px-4 py-4">
                    <UserIcon />
                    <span className="ml-3 font-medium text-lg">Trang cá nhân</span>
                </div>
            </Link>
            <Link to={"/change-password"} className="w-full rounded-lg hover:bg-footer">
                <div className="flex justify-start items-center px-4 py-4">
                    <ChangePasswordIcon />
                    <span className="ml-3 font-medium text-lg">Đổi mật khẩu</span>
                </div>
            </Link>
            <Link to={"/my-feedback"} className="w-full rounded-lg hover:bg-footer">
                <div className="flex justify-start items-center px-4 py-4">
                    <FaRegQuestionCircle size={16} style={{ margin: "5px" }} />
                    <span className="ml-3 font-medium text-lg">Gửi phản hồi</span>
                </div>
            </Link>
            <Link to={"all-courses"} className="w-full rounded-lg hover:bg-footer tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <AllcoursesIcon />
                    <span className="ml-3 font-medium text-lg">Tất cả khóa học</span>
                </div>
            </Link>
            <Link to={"my-enrolled-courses"} className="w-full rounded-lg hover:bg-footer tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <MyEnrollCourseIcon />
                    <span className="ml-3 font-medium text-lg">Khóa học đã đăng ký</span>
                </div>
            </Link>
            <Link to={"/my-courses"} className="w-full rounded-lg hover:bg-footer tablet:hidden">
                <div className="flex justify-start items-center px-4 py-4">
                    <MyCourseIcon />
                    <span className="ml-3 font-medium text-lg">Khóa học của tôi</span>
                </div>
            </Link>
            <div
                className="w-full flex justify-start items-center px-4 py-4 rounded-lg hover:bg-footer cursor-pointer"
                onClick={handleLogout}
            >
                <LogoutIcon />
                <span className="text-error ml-3 font-medium text-lg">Đăng xuất</span>
            </div>
        </>
    );
};

export default UserDropDown;
