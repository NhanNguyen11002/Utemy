import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { previewImage } from "../../../utils/helper";
import { NewCategory as CreateCategoryType } from "../../../types/category";
import { categoryActions } from "../../../redux/slices";
import { editCategoryValidationSchema } from "../../../validations/category";
// const FILE_TOO_BIG = 1;
// const FILE_IS_NOT_SUPPORT = 2;
// const FILE_IS_EMPTY = 3;
// const FILE_SUPPORT = ["image/jpeg", "image/png"];

type PopupEditCategoryProps = {
    categoryId: number;
    handleCancelEditCategory(): void;
};

const PopupEditCategory: React.FC<PopupEditCategoryProps> = (props) => {
    const category = useAppSelector((state) => state.categorySlice.category);
    const imageRef = useRef<HTMLImageElement>(null);
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.categorySlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const [image, setImage] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    // const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.currentTarget.files![0];
    //     if (file) {
    //         if (imageRef.current!.src) {
    //             imageRef.current!.src = URL.createObjectURL(file);
    //             if (file.size >= 1024 * 1024 * 4) {
    //                 setErrorImage(FILE_TOO_BIG);
    //             } else if (!FILE_SUPPORT.includes(file.type)) {
    //                 setErrorImage(FILE_IS_NOT_SUPPORT);
    //             } else {
    //                 setErrorImage(0);
    //             }
    //         }
    //     } else {
    //         setErrorImage(FILE_IS_EMPTY);
    //         imageRef.current!.src = props.urlAvatar;
    //     }
    // };
    const initialValues: CreateCategoryType = {
        title: category.title,
        description: category.description,
        category_image: undefined,
    };
    const handleOnSubmit = async (values: CreateCategoryType) => {
        const formData = new FormData();
        formData.append("category_id", props.categoryId.toString());
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("category_image", image as File);
        dispatch(categoryActions.editCategory(formData)).then((response: any) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(categoryActions.getCategoriesWithPagination({ pageIndex: 1, searchItem: "" }));
                props.handleCancelEditCategory();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImage(event.currentTarget.files![0]);
        const image = event.currentTarget.files![0];
        previewImage(image, imageRef);
    };
    useEffect(() => {
        dispatch(categoryActions.getCategory(props.categoryId));
    }, [dispatch, props.categoryId]);
    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                            CHỈNH SỬA DANH MỤC
                        </h1>
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize //!@$@$$#^%
                            validationSchema={editCategoryValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex rounded-lg items-start">
                                            <img
                                                ref={imageRef}
                                                alt={category.title}
                                                src={category.url_image}
                                                className="w-32 h-32 rounded-lg mr-3 outline-none border border-dashed border-black tablet:w-60 tablet:h-60"
                                            />
                                            <div className="flex flex-col gap-11 ">
                                                <div className="flex-1 flex flex-col w-full ">
                                                    <label
                                                        htmlFor="title"
                                                        className="text-sm mb-1 font-medium tablet:text-xl"
                                                    >
                                                        Tiêu đề
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        placeholder={category.title}
                                                        className={`${
                                                            formik.errors.title && formik.touched.title
                                                                ? "border-error"
                                                                : ""
                                                        } flex-1 w-full   resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                                    />
                                                    <ErrorMessage
                                                        name="title"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="">
                                                        <p className="text-lg font-medium">Chọn hình ảnh</p>
                                                        <p className="italic">Kích thước hình ảnh nhỏ hơn 4MB</p>
                                                    </div>
                                                    <Field
                                                        name="categoryImage"
                                                        type="file"
                                                        value={undefined}
                                                        className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            formik.setFieldValue(
                                                                "categoryImage",
                                                                event.currentTarget.files![0],
                                                            );
                                                            formik.setFieldError("categoryImage", undefined);
                                                            onChangeInputFile(event);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        name="categoryImage"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Mô tả
                                            </label>
                                            <Field
                                                as="textarea"
                                                type="text"
                                                name="description"
                                                id="description"
                                                placeholder={category.description}
                                                className={`${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[300px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="description"
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
                                            {isLoading || isGetLoading ? "Loading..." : "Lưu"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading || isGetLoading}
                                            onClick={() => {
                                                props.handleCancelEditCategory();
                                                // formik.resetForm(initialValues);
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

export default PopupEditCategory;
