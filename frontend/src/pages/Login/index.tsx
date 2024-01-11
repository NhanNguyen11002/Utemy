import { FC, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { Login as LoginType } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions, cartActions } from "../../redux/slices";
import constants from "../../constants";
import { Spin } from "../../components";
// import { Skeleton } from "@src/assets";
import { loginValidationSchema } from "../../validations/auth";
import toast from "react-hot-toast";

const Login: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isLogin: boolean = useAppSelector((state) => state.authSlice.isLogin);
    const isAdmin: boolean = useAppSelector((state) => state.authSlice.user.is_admin) as boolean;
    const isLoading: boolean = useAppSelector((state) => state.authSlice.isLoading);

    const formikRef = useRef(null);

    if (isLogin)
        if (isAdmin) return <Navigate to={"/admin"} />;
        else return <Navigate to={"/"} />;

    const initialValue: LoginType = {
        email: "",
        password: "",
    };

    const handleOnSubmit: (values: LoginType) => void = (values: LoginType) => {
        dispatch(authActions.setEmail(values.email));
        dispatch(authActions.login(values)).then((response: any) => {
            if (response.payload.status_code === 200) {
                if (response.payload.message === constants.success.SUCCESS_CHECK_MAIL) {
                    navigate("/check-mail");
                } else {
                    toast.success(response.payload.message);
                    dispatch(cartActions.getAllCart());
                    dispatch(authActions.getMe());
                }
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer border-0 border-black m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValue}
                            validationSchema={loginValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <Form className="p-4 " onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-lightblue font-Roboto text-center text-title">
                                        Đăng nhập
                                    </h1>
                                    <form className="">
                                        <div className="flex flex-col mb-3">
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
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                                Mật khẩu
                                            </label>
                                            <Field
                                                id="password"
                                                name="password"
                                                type="password"
                                                className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                    formik.errors.password && formik.touched.password
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </form>
                                    <button
                                        className="text-white btn w-full text-lg btn-info"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? "Loading..." : "Đăng nhập"}
                                    </button>
                                    <p className="block mt-3 mb-2 text-center text-lg">
                                        Bạn chưa có tài khoản?{" "}
                                        <span className="font-medium hover:opacity-80">
                                            <Link to={"/signup"}>Đăng ký</Link>
                                        </span>
                                    </p>
                                    <span className="block mt-3 mb-2 text-center font-medium text-lg hover:opacity-80">
                                        <Link to={"/forgot-password"}>Quên mật khẩu?</Link>
                                    </span>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="hidden tablet:block transition ease-in-out hover:scale-110 duration-200">
                        {/* <img src={Skeleton} alt="Freshemy" /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
