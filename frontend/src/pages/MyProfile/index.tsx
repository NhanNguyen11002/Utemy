import React, { useEffect, useState } from "react";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { UpdateInformation as UpdateInformationType, User as UserType } from "../../types/user";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions, authActions } from "../../redux/slices";
import { updateProfileValidationSchema } from "../../validations/user";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
// import PopUpChangeAvatar from "./PopUpChangeAvatar";
import { TextEditor } from "../../components";
import { DefaultAvatar } from "../../assets/images";

const MyProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user: UserType = useAppSelector((state) => state.authSlice.user);
    const initialValue: UserType = {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        description: user.description,
    };
    useEffect(() => {
        // @ts-ignore
        dispatch(authActions.getMe());
    }, [dispatch]);
    // Thêm state để theo dõi file được chọn
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Hàm xử lý khi người dùng chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        // Kiểm tra xem có file được chọn không
        if (files && files.length > 0) {
            const selectedFile = files[0];

            // Kiểm tra kích thước tối đa (ví dụ: 5MB)
            const maxSize = 4 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                toast.error(
                    "Hình ảnh có kích thước quá lớn, vui lòng chọn hình ảnh có kích thước nhỏ hơn hoặc bằng 4MB",
                );
                event.target.value = ""; // Reset input field
                return;
            }

            // Kiểm tra loại file (chỉ chấp nhận các loại ảnh)
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error("Sai loại file, vui lòng chọn file hợp lệ (JPEG, PNG, GIF).");
                event.target.value = ""; // Reset input field
                return;
            }

            // Lưu trữ file được chọn trong state hoặc tiếp tục xử lý
            setSelectedFile(selectedFile);
        }
    };

    const handleOnSubmit = async (values: UserType) => {
        // Tải lên avatar nếu có file được chọn
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append("avatar", selectedFile);

                // Gọi hàm xử lý upload avatar từ redux slice
                await dispatch(userActions.changeAvatar(formData));

                // Nếu thành công, có thể thực hiện các xử lý khác (ví dụ: cập nhật thông tin người dùng)
                // ...

                toast.success("Avatar updated successfully!");
                window.location.reload();
            } catch (error) {
                toast.error("Error updating avatar.");
            }
        }
        const data: UpdateInformationType = {
            first_name: values.first_name,
            last_name: values.last_name,
            description: values.description,
        };
        // @ts-ignore
        dispatch(userActions.updateProfile(data)).then((response) => {
            // Check if response.payload is defined
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
            } else {
                // Handle the case where response.payload is undefined
                toast.error("An error occurred.");
            }
        });
    };
    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };
    const handleLogout = () => {
        // @ts-ignore
        dispatch(authActions.logout());
        navigate("/");
    };

    return (
        <>
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-title text-lightblue">TRANG CỦA TÔI</h1>
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center justify-center">
                            {/* <div className="w-32 h-32 rounded-full border">
                                <PopUpChangeAvatar urlAvatar={user.url_avatar || DefaultAvatar} userId={user.user_id} />
                            </div> */}
                            <Formik
                                initialValues={initialValue}
                                validationSchema={updateProfileValidationSchema}
                                onSubmit={handleOnSubmit}
                                enableReinitialize={true}
                            >
                                {(formik) => (
                                    <Form
                                        className="flex items-center justify-center flex-row"
                                        onSubmit={formik.handleSubmit}
                                    >
                                        {/* Avatar frame */}
                                        <div className="w-auto h-auto mr-8 overflow-hidden">
                                            {/* Display the selected avatar or default avatar if none */}
                                            {selectedFile || user.url_avatar ? (
                                                <img
                                                    src={
                                                        selectedFile
                                                            ? URL.createObjectURL(selectedFile)
                                                            : user.url_avatar
                                                              ? user.url_avatar
                                                              : DefaultAvatar
                                                    }
                                                    alt="Avatar"
                                                    className="max-w-xs max-h-80 min-h-full min-w-full border-4 rounded-lg"
                                                />
                                            ) : (
                                                <img
                                                    src={DefaultAvatar}
                                                    alt="Default Avatar"
                                                    className="max-w-xs max-h-80 min-h-full min-w-full border-4 rounded-lg"
                                                />
                                            )}

                                            {/* Avatar input */}
                                            <label
                                                htmlFor="avatar"
                                                className="block text-sm mb-1 tablet:text-xl text-center"
                                            >
                                                Chọn ảnh đại diện
                                            </label>
                                            <input
                                                id="avatar"
                                                name="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="px-2 py-1 rounded-lg border-[1px] outline-none"
                                            />
                                        </div>

                                        <div className="bg-white m-4 rounded-xl shadow-lg p-4 max-w-[440px]">
                                            <div className="flex flex-col mobile:flex-row gap-2">
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="first_name" className="text-sm mb-1 tablet:text-xl">
                                                        Tên
                                                    </label>
                                                    <Field
                                                        name="first_name"
                                                        id="first_name"
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
                                                <div className="flex flex-col mb-3">
                                                    <label htmlFor="last_name" className="text-sm mb-1 tablet:text-xl">
                                                        Họ
                                                    </label>
                                                    <Field
                                                        name="last_name"
                                                        id="last_name"
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
                                                    id="email"
                                                    disabled={true}
                                                    type="text"
                                                    className={`px-2 py-4 w-full rounded-lg border-[1px] outline-none${
                                                        formik.errors.email && formik.touched.email
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="email"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="h-[300px]">
                                                <label htmlFor="description" className="text-sm mb-1 tablet:text-xl">
                                                    Mô tả về bạn
                                                </label>
                                                <ErrorMessage
                                                    name="description"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    id="description"
                                                    component={TextEditor}
                                                    description={user.description}
                                                    handleChangeDescription={(description: string) =>
                                                        handleDescriptionChange(description, formik)
                                                    }
                                                    className={`${
                                                        formik.errors.description && formik.touched.description
                                                            ? "border-error"
                                                            : ""
                                                    } flex-1 w-full rounded-md border border-[#e0e0e0] py-4 px-4  outline-none focus:shadow-md1`}
                                                />
                                            </div>
                                            <div className="flex justify-end mt-15">
                                                <button
                                                    className="text-white btn btn-info text-lg hover:bg-lightblue/80"
                                                    type="submit"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    className="btn ml-2 btn-error text-white text-lg hover:bg-red-500"
                                                    onClick={handleLogout}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfile;
