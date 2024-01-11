import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { ForgotPassword as ForgotPasswordType } from "../../types/auth";
import { forgotPasswordValidationSchema } from "../../validations/auth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const [message, setMessage] = useState("");

    const dispatch = useAppDispatch();

    if (isLogin) return <Navigate to={"/"} />;

    const initialValues: ForgotPasswordType = {
        email: "",
    };

    const handleSubmit = (values: ForgotPasswordType) => {
        dispatch(authActions.forgotPassword(values)).then((response: any) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                setMessage(response.payload.message);
            } else {
                toast.error(response.payload.message);
                setMessage(response.payload.message);
            }
        });
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={forgotPasswordValidationSchema}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-center text-lightblue text-title">
                                        QUÊN MẬT KHẨU
                                    </h1>
                                    {message !== "" ? (
                                        <div className="my-4 px-4 py-3 rounded text-center">
                                            <p className="font-bold text-info text-xl">
                                                Kiểm tra email để nhận thông tin
                                            </p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    <form className="flex flex-col mb-3">
                                        <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                            Email
                                        </label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="text"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                formik.errors.email && formik.touched.email ? "border-error" : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </form>
                                    <button className="text-white btn btn-info w-full text-lg" type="submit">
                                        {message !== "" ? "Gửi lại email" : "Đặt lại mật khẩu"}
                                    </button>
                                    <span className="block mt-3 mb-2 text-center font-medium text-lg hover:opacity-80">
                                        <Link to={"/login"}>Quay lại trang đăng nhập</Link>
                                    </span>
                                    <div className="text-center text-lg hover:opacity-80">
                                        Chưa có tài khoản?
                                        <Link to={"/signup"}>
                                            <span className="font-medium"> Đến trang đăng ký</span>
                                        </Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
