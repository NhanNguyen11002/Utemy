import React, { useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { componentActions, userActions } from "../../../redux/slices";
import { createUserValidationSchema } from "../../../validations/user";
import { CustomeSelect } from "../../../components";
import { images } from "../../../assets";
import { CreateNewUser } from "../../../types/user";

import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

const CreateUser = () => {
    // const navigate = useNavigate();
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const dispatch = useAppDispatch();
    const formikRef = useRef(null);
    const initialValue = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        is_admin: false,
    };
    const roleOptions = [
        {
            value: true,
            label: "Admin",
        },
        {
            value: false,
            label: "User",
        },
    ];
    const handleChangeStatus = (event: any, formik: any) => {
        formik.setFieldValue("is_admin", event.value as boolean);
    };
    const customStyles = {
        control: (styles: any) => ({
            ...styles,
            position: "static",
            transform: "none",
            borderRadius: "0.375rem",
            padding: "10px",
            boxShadow: "",
        }),
        option: (styles: any) => ({
            ...styles,
        }),
        menu: (styles: any) => ({
            ...styles,
            borderRadius: "0.375rem",
            boxShadow: "0 1px 2px, 0 2px 4px",
        }),
    };
    useEffect(() => {
        dispatch(componentActions.setAdminNavPlace("UserCreate"));
    }, [dispatch]);

    const handleOnSubmit = (values: CreateNewUser, actions: any) => {
        console.log(values);
        const data = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            is_admin: values.is_admin,
            password: values.password,
            confirm_password: values.confirm_password,
        };
        dispatch(userActions.createNewUser(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                actions.resetForm();
            } else if (response.payload) toast.error(response.payload.message);
        });
    };

    return (
        <>
            <div className="mt-12 mb-8 flex flex-row items-start justify-between bg-background_2 min-h-screen">
                <Toaster />
                <div className="w-1/3 flex ">
                    <Formik
                        initialValues={initialValue}
                        validationSchema={createUserValidationSchema}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <Form
                                onSubmit={formik.handleSubmit}
                                className="p-4 border bg-background rounded-2xl border-gray-400 shadow-lg"
                            >
                                <h1 className="text-2xl my-5 font-bold text-center text-lightblue text-title">
                                    THÊM NGƯỜI DÙNG
                                </h1>
                                <div className="flex flex-col items-center">
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
                                    <div className="flex flex-col mb-3 w-full">
                                        <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                            Email
                                        </label>
                                        <Field
                                            name="email"
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
                                    <div className="flex flex-col mb-3 w-full">
                                        <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                            Mật khẩu
                                        </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            className={`px-2 py-4 w-full rounded-lg border-[1px] outline-none${
                                                formik.errors.password && formik.touched.password ? "border-error" : ""
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col mb-3 w-full">
                                        <label htmlFor="confirm_password" className="text-sm mb-1 tablet:text-xl">
                                            Nhập lại mật khẩu
                                        </label>
                                        <Field
                                            name="confirm_password"
                                            type="password"
                                            className={`px-2 py-4 w-full rounded-lg border-[1px] outline-none${
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
                                    <div className="flex-1 flex flex-col w-full">
                                        <label
                                            htmlFor="status"
                                            className="text-sm mb-1 w-1/2 font-medium tablet:text-xl"
                                        >
                                            Loại tài khoản
                                        </label>
                                        <Field
                                            className="w-full"
                                            name="status"
                                            component={CustomeSelect}
                                            handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                            options={roleOptions}
                                            isMulti={false}
                                            placeholder={"User"}
                                            styles={customStyles}
                                        />
                                        <ErrorMessage
                                            name="status"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="mt-[12px] m-auto w-full ">
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className="text-white  w-full btn btn-info text-lg"
                                    >
                                        {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                        {isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="w-2/3 h-fit flex justify-end 2xl:justify-start">
                    <img
                        src={images.CreateUser}
                        alt="panel"
                        className=" rounded-3xl hidden laptop:block laptop:w-3/4"
                    />
                </div>
            </div>
        </>
    );
};

export default CreateUser;
