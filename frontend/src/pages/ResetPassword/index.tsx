import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { useNavigate, useParams } from "react-router-dom";
import { ResetPassword as ResetPasswordType } from "../../types/auth";
import { resetPasswordValidationSchema } from "../../validations/auth";
import toast from "react-hot-toast";

const ResetPassword: React.FC<{}> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const isLoading: boolean = useAppSelector((state) => state.authSlice.isLoading);
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    if (isLogin) navigate("/");

    // Check token is undefined and navigate to homepage
    if (token === undefined) {
        navigate("/");
    }

    const initialValues: ResetPasswordType = {
        new_password: "",
        confirm_password: "",
        token: "",
    };

    const handleSubmit = (values: ResetPasswordType) => {
        const data = {
            ...values,
            token: token as string,
        };
        dispatch(authActions.resetPassword(data)).then((response: any) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                navigate("/login");
            } else {
                toast.error(response.payload.message);
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
                            validationSchema={resetPasswordValidationSchema}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-lightblue text-center text-title">
                                        Đặt lại mật khẩu
                                    </h1>
                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="new_password" className="text-sm mb-1 tablet:text-xl">
                                            Mật khẩu mới
                                        </label>
                                        <Field
                                            id="new_password"
                                            name="new_password"
                                            type="password"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg ${
                                                formik.errors.new_password && formik.touched.new_password
                                                    ? "border-error"
                                                    : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="new_password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="confirm_password" className="text-sm mb-1 tablet:text-xl">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <Field
                                            id="confirm_password"
                                            name="confirm_password"
                                            type="password"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg ${
                                                formik.errors.confirm_password && formik.touched.confirm_password
                                                    ? "border-error"
                                                    : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="confirm_password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <button
                                        className="text-white btn btn-info w-full text-lg"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
