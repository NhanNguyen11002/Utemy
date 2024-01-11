import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { userActions } from "../../../redux/slices";
import { EditUser, User } from "../../../types/user";
import { CustomeSelect } from "../../../components";
import { editUserValidationSchema } from "../../../validations/user";

type PopupEditUserProps = {
    editUser: User;
    handleCancelEditUser(): void;
};
// type Options = {
//     value: number;
//     label: string;
// };

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
const PopupEditUser: React.FC<PopupEditUserProps> = (props) => {
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const dispatch = useAppDispatch();

    const initialValues: EditUser = {
        first_name: props.editUser.first_name,
        last_name: props.editUser.last_name,
        is_admin: props.editUser.is_admin as boolean,
    };
    const handleOnSubmit = async (values: EditUser) => {
        const data = {
            ...values,
            id: props.editUser.user_id,
        };
        console.log("values formik", data);
        dispatch(userActions.editUser(data)).then((response: any) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ pageIndex: 1, searchItem: "", role: "All" }));
                props.handleCancelEditUser();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
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

    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[630px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                            CHỈNH SỬA NGƯỜI DÙNG
                        </h1>
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize //!@$@$$#^%
                            validationSchema={editUserValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="first_name"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Tên
                                            </label>
                                            <Field
                                                as="input"
                                                type="text"
                                                name="first_name"
                                                id="first_name"
                                                placeholder={"First name here..."}
                                                className={`${
                                                    formik.errors.first_name && formik.touched.first_name
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="first_name"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="last_name"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Họ
                                            </label>
                                            <Field
                                                as="input"
                                                type="text"
                                                name="last_name"
                                                id="last_name"
                                                placeholder={"Last name here"}
                                                className={`${
                                                    formik.errors.last_name && formik.touched.last_name
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="last_name"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label htmlFor="status" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Loại tài khoản
                                            </label>
                                            <Field
                                                className="w-full"
                                                name="status"
                                                component={CustomeSelect}
                                                handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                                options={roleOptions}
                                                isMulti={false}
                                                placeholder={`${props.editUser.is_admin ? "Admin" : "User"}`}
                                                styles={customStyles}
                                            />
                                            <ErrorMessage
                                                name="status"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="py-[12px] flex justify-end">
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="text-white btn btn-info text-lg"
                                        >
                                            {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                            {isLoading ? "Loading..." : "Lưu"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading}
                                            onClick={() => {
                                                props.handleCancelEditUser();
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopupEditUser;
