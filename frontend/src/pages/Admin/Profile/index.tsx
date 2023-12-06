import React, { useEffect } from "react";
import { DefaultAvatar } from "../../../assets/images";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { authActions, componentActions, userActions } from "../../../redux/slices";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import PopUpChangeAvatar from "./PopupChangeAvatar";
import { ChangePassword } from "../../../types/auth";
import { UpdateInformation } from "../../../types/user";
import toast, { Toaster } from "react-hot-toast";
import { changePasswordValidationSchema, updateProfileValidationSchema } from "../../../validations/user";

const ProfileAdmin = () => {
    const user = useAppSelector((state) => state.authSlice.user);
    console.log(user);
    const dispatch = useAppDispatch();
    const initialValue = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        description: user.description,
    };
    const initialValueChangePassword = {
        current_password: "",
        new_password: "",
        confirm_password: "",
    };
    useEffect(() => {
        dispatch(authActions.getMe());
        dispatch(componentActions.setAdminNavPlace("Profile"));
    }, [dispatch]);
    const handleAfterChangeAvatar = () => {
        dispatch(authActions.getMe());
    };
    const handleOnEditProfile = (values: UpdateInformation) => {
        dispatch(userActions.updateProfile(values)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(authActions.getMe());
            } else if (response.payload) toast.error(response.payload.message);
        });
    };

    const handleChangePassword = (values: ChangePassword, actions: any) => {
        dispatch(authActions.changePassword(values)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                actions.resetForm();
            } else if (response.payload) toast.error(response.payload.message);
        });
    };
    return (
        <>
            <div className="mt-12 mb-8 flex flex-col gap-12 bg-background_2 min-h-screen">
                <Toaster />
                <div className="flex bg-background flex-col items-center">
                    <div className="flex flex-row w-3/4 h-1/4 bg-background m-auto rounded-xl shadow-lg p-6 ">
                        <div className="w-2/4 px-5 m-auto p-auto flex ">
                            <div className="w-32 h-32 rounded-full border">
                                <PopUpChangeAvatar
                                    handleAfterChangeAvatar={handleAfterChangeAvatar}
                                    urlAvatar={user.url_avatar || DefaultAvatar}
                                />
                            </div>
                            <div className=" flex flex-col text-left w-1/2 m-auto gap-4">
                                <h1 className=" text-xl">
                                    Xin chào,{" "}
                                    <span className="text-xl font-bold text-lightblue">
                                        {user.first_name}
                                        {user.last_name}
                                    </span>
                                </h1>
                                <div
                                    className={`${
                                        user.is_admin ? "badge badge-info badge-outline" : "badge badge-outline"
                                    } text-xl  badge-lg`}
                                >
                                    {user.is_admin ? (
                                        <StarIcon className="w-4 h-4" />
                                    ) : (
                                        <UserCircleIcon className="w-4 h-4" />
                                    )}
                                    {user.is_admin ? "Admin" : "User"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-3/4 ">
                        <Formik
                            initialValues={initialValue}
                            validationSchema={updateProfileValidationSchema}
                            onSubmit={handleOnEditProfile}
                            enableReinitialize={true}
                        >
                            {(formik) => (
                                <Form
                                    className="flex flex-col items-center  w-1/2 h-full "
                                    onSubmit={formik.handleSubmit}
                                >
                                    <div className="bg-background m-4 w-full rounded-xl shadow-lg p-4  border-gray-400 border">
                                        <div className="flex flex-col mobile:flex-row gap-2 w-full justify-between ">
                                            <div className="flex flex-col mb-3 w-1/2 ">
                                                <label htmlFor="first_name" className="text-sm mb-1 tablet:text-xl">
                                                    Tên
                                                </label>
                                                <Field
                                                    name="first_name"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                        formik.errors.first_name && formik.touched.first_name
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="first_name"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-3 w-1/2">
                                                <label htmlFor="last_name" className="text-sm mb-1 tablet:text-xl">
                                                    Họ
                                                </label>
                                                <Field
                                                    name="last_name"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                        formik.errors.last_name && formik.touched.last_name
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="last_name"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                                Email
                                            </label>
                                            <Field
                                                name="email"
                                                disabled={true}
                                                type="text"
                                                className={`px-2 py-4 w-full rounded-lg border-[1px] outline-none${
                                                    formik.errors.email && formik.touched.email ? "border-error" : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label htmlFor="description" className="text-sm mb-1 tablet:text-xl">
                                                Mô tả về tôi
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Mô tả về tôi..."
                                                className={`${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full rounded-md  py-4 px-4 text-area  outline-none shadow-md1 border border-[#e0e0e0]`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <button className="text-white btn btn-info text-lg" type="submit">
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <Formik
                            initialValues={initialValueChangePassword}
                            validationSchema={changePasswordValidationSchema}
                            onSubmit={handleChangePassword}
                        >
                            {(formik) => (
                                <Form
                                    className="bg-background m-4 rounded-xl shadow-lg p-4 w-1/2 flex flex-col justify-between border-gray-400 border "
                                    onSubmit={formik.handleSubmit}
                                >
                                    <div className="flex flex-col justify-start">
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="current_password" className="text-sm mb-1 tablet:text-xl">
                                                Mật khẩu hiện tại
                                            </label>
                                            <Field
                                                type="password"
                                                placeholder="Mật khẩu hiện tại..."
                                                className="px-2 py-4 w-full rounded-lg border-[1px] outline-none"
                                                id="current_password"
                                                name="current_password"
                                            />
                                            <ErrorMessage
                                                name="current_password"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="new_password" className="text-sm mb-1 tablet:text-xl">
                                                Mật khẩu mới
                                            </label>
                                            <Field
                                                type="password"
                                                placeholder="Mật khẩu mới..."
                                                className="px-2 py-4 w-full rounded-lg border-[1px] outline-none"
                                                id="new_password"
                                                name="new_password"
                                            />
                                            <ErrorMessage
                                                name="new_password"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="confirm" className="text-sm mb-1 tablet:text-xl">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <Field
                                                type="password"
                                                placeholder="Xác nhận mật khẩu..."
                                                className="px-2 py-4 w-full rounded-lg border-[1px] outline-none"
                                                id="confirm_password"
                                                name="confirm_password"
                                            />
                                            <ErrorMessage
                                                name="confirm_password"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="btn-info btn text-white text-lg hover:bg-lightblue/80"
                                        >
                                            Đổi mật khẩu
                                        </button>
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

export default ProfileAdmin;
