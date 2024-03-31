import React, { FC, useEffect, useRef, useState } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { NewCourse as CreateCourseType } from "../../types/course";
import { Category } from "../../types/category";
import { categoryActions, courseActions } from "../../redux/slices";
import { createCourseValidationSchema } from "../../validations/course";
import slugify from "slugify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomeSelect, TextEditor, StudyPopup, RequirementPopup } from "../../components";
import { previewImage } from "../../utils/helper";

type CategoriesOptions = {
    value: number;
    label: string;
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

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [study, setStudy] = useState([]);
    const [requirement, setRequirement] = useState([]);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const categories: Category[] = useAppSelector((state) => state.categorySlice.categories) ?? [];
    const formikRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    const categoriesOptions: CategoriesOptions[] = [];

    useEffect(() => {
        categories.forEach((category: Category) => {
            const temp: CategoriesOptions = {
                value: category.category_id,
                label: category.title,
            };
            categoriesOptions.push(temp);
        });
    }, [categories, categoriesOptions]);
    useEffect(() => {
        dispatch(categoryActions.getCategories());
        setThumbnail(null);
    }, [dispatch]);

    const initialValues: CreateCourseType = {
        title: "",
        categories: [],
        status: false,
        summary: "",
        description: "",
        thumbnail: null,
        slug: "",
        price: 0,
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        const slug = slugify(values.title.toLowerCase());
        const categories = values.categories.map((item: any) => item.value);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("slug", slug);
        formData.append("summary", values.summary);
        formData.append("price", values.price.toString());
        formData.append("categories", categories.toString());
        formData.append("thumbnail", thumbnail as File);
        formData.append("description", values.description);
        formData.append("study", JSON.stringify(study));
        formData.append("requirement", JSON.stringify(requirement));
        dispatch(courseActions.createCourses(formData)).then((createCourseResponse: any) => {
            if (createCourseResponse.payload && createCourseResponse.payload.status_code === 201) {
                toast.success(createCourseResponse.payload.message);
                navigate("/lecturer");
            } else {
                toast.error(createCourseResponse.payload?.message as string);
            }
        });
    };

    const handleChangeCategories = (event: any, formik: any) => {
        formik.setFieldValue("categories", event);
        console.log(formik.values);
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(event.currentTarget.files![0]);
        const thumbnail = event.currentTarget.files![0];
        previewImage(thumbnail, imageRef);
    };
    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };
    const handleSubmitStudy = (study: any) => {
        setStudy(study);
    };
    const handleSubmitRequirement = (requirement: any) => {
        setRequirement(requirement);
    };
    return (
        <>
            <div className="min-h-screen h-full px-4 tablet:px-[60px] mt-[100px] laptop:mt-0">
                <h1 className="text-center text-[32px] py-4 font-bold text-lightblue text-title">Tạo khóa học mới</h1>
                <div className="w-full flex justify-center items-center shrink-0">
                    <div className="m-4 rounded-xl border border-black w-full max-w-[982px] bg-background">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createCourseValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex">
                                        <div className="flex rounded-lg items-start">
                                            <img
                                                ref={imageRef}
                                                alt="Thumbnail"
                                                className="w-32 h-32 rounded-lg mr-3 outline-none border border-dashed border-black tablet:w-60 tablet:h-60"
                                            />
                                            <div className="flex flex-col gap-3">
                                                <div className="">
                                                    <p className="text-lg font-medium">Chọn ảnh bìa</p>
                                                    <p className="italic">Kích thước ảnh nhỏ hơn hoặc bằng 4mb</p>
                                                </div>
                                                <Field
                                                    name="thumbnail"
                                                    type="file"
                                                    value={undefined}
                                                    className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        formik.setFieldValue(
                                                            "thumbnail",
                                                            event.currentTarget.files![0],
                                                        );
                                                        formik.setFieldError("thumbnail", undefined);
                                                        onChangeInputFile(event);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="thumbnail"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <label htmlFor="title" className="text-sm mb-1 font-medium tablet:text-xl">
                                            Tên khóa học
                                        </label>
                                        <Field
                                            type="text"
                                            name="title"
                                            className={`${
                                                formik.errors.title && formik.touched.title ? "border-error" : ""
                                            } px-2 py-4 rounded-lg border-[1px] outline-none w-full`}
                                        />
                                        <ErrorMessage
                                            name="title"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-row gap-4 my-3">
                                        <div className="flex-1 flex gap-3 items-center">
                                            <div className="flex flex-col w-1/2 gap-4">
                                                <div className="flex flex-col">
                                                    <label
                                                        htmlFor="price"
                                                        className="text-sm mb-1 font-medium tablet:text-xl"
                                                    >
                                                        Giá
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="price"
                                                        className={`${
                                                            formik.errors.price && formik.touched.price
                                                                ? "border-error"
                                                                : ""
                                                        } px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg`}
                                                    />
                                                    <ErrorMessage
                                                        name="price"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="w-full flex justify-between mt-3 items-center">
                                                    <label className="text-sm mb-1 font-medium tablet:text-xl">
                                                        Tổng quan khóa học
                                                    </label>
                                                    <StudyPopup study={study} handleSubmit={handleSubmitStudy} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col w-1/2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="category"
                                                        className="text-sm mb-1 font-medium tablet:text-xl"
                                                    >
                                                        Danh mục
                                                    </label>
                                                    <div
                                                        className={`${
                                                            formik.errors.categories && formik.touched.categories
                                                                ? "border-error"
                                                                : ""
                                                        } border-[1px] rounded-md`}
                                                    >
                                                        <Field
                                                            name="categories"
                                                            component={CustomeSelect}
                                                            handleOnchange={(e: any) =>
                                                                handleChangeCategories(e, formik)
                                                            }
                                                            placeholder={"Chọn danh mục"}
                                                            options={categoriesOptions}
                                                            isMulti={true}
                                                            defautlValues={""}
                                                            styles={customStyles}
                                                        />
                                                    </div>
                                                    <ErrorMessage
                                                        name="categories"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>

                                                <div className="w-full flex justify-between mt-3 items-center">
                                                    <label className="text-sm mb-1 font-medium tablet:text-xl">
                                                        Yêu cầu khóa học
                                                    </label>
                                                    <RequirementPopup
                                                        requirement={requirement}
                                                        handleSubmit={handleSubmitRequirement}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sumary mt-4 w-full">
                                        <label htmlFor="summary" className="text-sm mb-1 font-medium tablet:text-xl">
                                            Tóm tắt
                                        </label>
                                        <Field
                                            type="text"
                                            name="summary"
                                            className={`${
                                                formik.errors.summary && formik.touched.summary ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="summary"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col w-full h-[300px]">
                                        <label
                                            htmlFor="description"
                                            className="text-sm mb-1 font-medium tablet:text-xl"
                                        >
                                            Mô tả
                                        </label>
                                        <ErrorMessage
                                            name="description"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                        <Field
                                            as="textarea"
                                            name="description"
                                            component={TextEditor}
                                            handleChangeDescription={(description: string) =>
                                                handleDescriptionChange(description, formik)
                                            }
                                            className={`${
                                                formik.errors.description && formik.touched.description
                                                    ? "border-error"
                                                    : ""
                                            } flex-1 w-full  resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                        />
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
                                                formik.resetForm(initialValues);
                                            }}
                                        >
                                            <Link to={`/my-courses`}>Hủy</Link>
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

export default CreateCourse;
