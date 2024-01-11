import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { PaperAirplaneIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";
import { authActions } from "../../redux/slices";
import toast from "react-hot-toast";

const CheckMail: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    const email = useAppSelector((state) => state.authSlice.user.email);
    const isLoading = useAppSelector((state) => state.authSlice.isLoading);
    if (isLogin) return <Navigate to={"/"} />;
    const handleOnClick = () => {
        dispatch(authActions.resendVerifyEmail(email)).then((response) => {
            if (response.payload?.status_code === 200) toast.success(response.payload.message);
        });
    };

    return (
        <>
            <div className="mt-[100px] h-screen flex items-center justify-center space-x-[1rem]">
                <div className="bg-footer border-md bordey-gray-600 shadow-lg rounded-md  w-1/2 h-[300px] gap-3 flex flex-col items-center justify-center ">
                    <p className="text-3xl bold text-black">Tài khoản của bạn chưa được xác nhận</p>
                    <EnvelopeIcon className="h-20 w-20" />
                    <p className="text-xl  text-black">Vui lòng kiểm tra email để xác nhận tài khoản này</p>
                    <div className="flex gap-2">
                        <button type="button" className="btn btn-info text-white" onClick={handleOnClick}>
                            {isLoading ? (
                                "Loading..."
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="w-4 h-4" /> Gửi lại email
                                </>
                            )}
                        </button>
                        <button type="button" className="btn text-black" onClick={() => navigate("/")}>
                            <HomeIcon className="w-4 h-4" /> Trở về trang chủ
                        </button>
                    </div>
                </div>

                <div className="hidden tablet:block">{/* <img src={Skeleton} alt="Login img" /> */}</div>
            </div>
        </>
    );
};

export default CheckMail;
