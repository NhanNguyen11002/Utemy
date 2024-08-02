import { FC, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { Signup as SignupType } from "../../types/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupValidationSchema } from "../../validations/auth";
const Signup: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    const isLoading = useAppSelector((state) => state.authSlice.isLoading);
    let errorMessage = useAppSelector((state) => state.authSlice.error);
    let successMessage = "";

    const formikRef = useRef(null);

    if (isLogin) return <Navigate to={"/"} />;

    const initialValues: SignupType = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const handleOnSubmit = async (values: SignupType) => {
        dispatch(authActions.signup(values)).then((response: any) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                navigate("/");
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    const handleDeleteMessage = () => {
        errorMessage = "";
        successMessage = "";
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={signupValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <Form onSubmit={formik.handleSubmit} className="p-4" onChange={handleDeleteMessage}>
                                    <h1 className="font-bold text-[32px] text-center text-lightblue text-title">
                                        ĐĂNG KÝ
                                    </h1>

                                    <div className="flex flex-col gap-3 mb-3 tablet:flex-row">
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="first_name" className="text-sm mb-1 tablet:text-xl">
                                                Tên
                                            </label>
                                            <Field
                                                type="text"
                                                name="first_name"
                                                id="first_name"
                                                autoComplete="true"
                                                className={`${
                                                    formik.errors.first_name && formik.touched.first_name
                                                        ? "border-error"
                                                        : ""
                                                } px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm`}
                                            />
                                            <ErrorMessage
                                                name="first_name"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label htmlFor="last_name" className="text-sm mb-1 tablet:text-xl">
                                                Họ
                                            </label>
                                            <Field
                                                type="text"
                                                name="last_name"
                                                id="last_name"
                                                autoComplete="true"
                                                className={`${
                                                    formik.errors.last_name && formik.touched.last_name
                                                        ? "border-error"
                                                        : ""
                                                } px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm`}
                                            />
                                            <ErrorMessage
                                                name="last_name"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="text-sm block mb-1 tablet:text-xl">
                                            Email
                                        </label>
                                        <Field
                                            type="text"
                                            name="email"
                                            id="email"
                                            autoComplete="true"
                                            className={`${
                                                formik.errors.email && formik.touched.email ? "border-error" : ""
                                            } px-2 py-4 rounded-lg border-[1px] outline-none w-full`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="text-sm block mb-1 tablet:text-xl">
                                            Mật khẩu
                                        </label>
                                        <Field
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`${
                                                formik.errors.password && formik.touched.password ? "border-error" : ""
                                            } px-2 py-4 rounded-lg border-[1px] outline-none w-full`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirm_password" className="text-sm block mb-1 tablet:text-xl">
                                            Xác nhận mật khẩu
                                        </label>
                                        <Field
                                            type="password"
                                            name="confirm_password"
                                            id="confirm_password"
                                            className={`${
                                                formik.errors.confirm_password && formik.touched.confirm_password
                                                    ? "border-error"
                                                    : ""
                                            } px-2 py-4 rounded-lg border-[1px] outline-none w-full`}
                                        />
                                        <ErrorMessage
                                            name="confirm_password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                        {errorMessage !== "" && (
                                            <span className="text-[14px] text-error font-medium">{errorMessage}</span>
                                        )}
                                        {successMessage !== "" && (
                                            <span className="text-[14px] text-success font-medium">
                                                {successMessage}
                                            </span>
                                        )}
                                    </div>
                                    <div className="py-[12px]">
                                        <button
                                            disabled={errorMessage !== "" ? true : false}
                                            type="submit"
                                            className="text-white btn btn-info w-full text-lg"
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? "Loading..." : "Tạo tài khoản"}
                                        </button>
                                    </div>
                                    <div className="text-center space-y-[8px]">
                                        <p className="block mt-3 mb-2 text-center text-lg">
                                            Bạn đã có tài khoản?
                                            <span className="font-medium hover:opacity-80">
                                                <Link to={"/login"}> Quay lại đăng nhập</Link>
                                            </span>
                                        </p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="hidden laptop:block transition ease-in-out hover:scale-110 duration-200">
                        {/* <img src={Skeleton} alt="Freshemy" /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
