import React, { useEffect, useState, useRef } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import { editCourseValidationSchema } from "../../validations/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { CustomeSelect, TextEditor } from "../../components";
import { categoryActions, courseActions } from "../../redux/slices";
import { EditCourse, Course } from "../../types/course";
import { Category as CategoryType } from "../../types/category";
import slugify from "slugify";
import toast from "react-hot-toast";
import { previewImage, previewTrailer } from "../../utils/helper";
import Hls from "hls.js";

type Options = {
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
type props = {
    course_id: number;
};

const EditForm: React.FC<props> = (props) => {
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [errorTrailer, setErrorTrailer] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [trailer, setTrailer] = useState<File | null>(null);
    const categories = useAppSelector((state) => state.categorySlice.categories); // all category
    const categoriesOptionsTemp = categories.map((category) => {
        const option: Options = {
            value: category.category_id,
            label: category.title,
        };
        return option;
    });
    const [categoriesOptions, setCategoriesOptions] = useState<Options[]>(categoriesOptionsTemp);
    // danh sach cac option cua hop chon category
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const courseCategories = courseDetail.categories; // danh sach cac category cua course
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const imageRef = useRef<HTMLImageElement>(null);
    const trailerRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    const chosenOptionsCategories: Options[] = [];
    courseCategories.forEach((category: CategoryType) => {
        const temp: Options = {
            value: category.category_id,
            label: category.title,
        };

        chosenOptionsCategories.push(temp);
    });
    const initialValue: EditCourse = {
        title: courseDetail.title,
        summary: courseDetail.summary,
        categories: chosenOptionsCategories,
        status: courseDetail.status,
        description: courseDetail.description,
        course_id: Number(props.course_id),
        slug: courseDetail.slug,
        price: Number(courseDetail.price),
        thumbnail: null,
        trailer: null,
    };
    const dispatch = useAppDispatch();
    useEffect(() => {
        const videoElement = trailerRef.current;

        if (videoElement && courseDetail.url_trailer) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(courseDetail.url_trailer);
                hls.attachMedia(videoElement);
            } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
                videoElement.src = courseDetail.url_trailer;
            }
        }
    }, [courseDetail.url_trailer]);

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch, props.course_id]);

    useEffect(() => {
        // lọc đưa các category chưa được chọn vào box
        let createTemp = [...courseCategories];
        let cateTemp = [...categories];
        const cateOptionsTemp: any = [];
        createTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.category_id === category.category_id);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.category_id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setCategoriesOptions(cateOptionsTemp);
    }, [courseCategories, categories]);

    const handleChangeCategories = (event: any, formik: any) => {
        let createdTemp = JSON.parse(JSON.stringify(event));
        let cateTemp = JSON.parse(JSON.stringify(categories));
        const cateOptionsTemp: any = [];
        createdTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.id === category.value);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.category_id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setCategoriesOptions(cateOptionsTemp);
        formik.setFieldValue("categories", event);
    };

    const onChangeInputThumbnailFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files![0] && event.currentTarget.files![0].size > 1024 * 1024 * 4) {
            setErrorImage(true);
        } else {
            setErrorImage(false);
            setThumbnail(event.currentTarget.files![0]);
            const thumbnail = event.currentTarget.files![0];
            previewImage(thumbnail, imageRef, courseDetail.thumbnail);
        }
    };
    const onChangeInputTrailerFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files![0] && event.currentTarget.files![0].size > 1024 * 1024 * 1000) {
            setErrorTrailer(true);
        } else {
            setErrorTrailer(false);
            setTrailer(event.currentTarget.files![0]);
            const trailer = event.currentTarget.files![0];
            previewTrailer(trailer, trailerRef, courseDetail.url_trailer);
        }
    };

    const handleOnSubmit = (values: EditCourse) => {
        const categories = values.categories.map((item: any) => item.value);
        const slug = slugify(values.title.toLowerCase());
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("course_id", props.course_id.toString());
        formData.append("slug", slug);
        formData.append("description", values.description);
        formData.append("summary", values.summary);
        formData.append("price", values.price.toString());
        formData.append("categories", categories.toString());
        formData.append("thumbnail", thumbnail as File);
        if (trailer) formData.append("trailer", trailer as File);

        dispatch(courseActions.editCourse(formData)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(courseActions.getCourseDetailById(props.course_id));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };

    return (
        <>
            {isGetLoading !== true && (
                <>
                    <div className="w-full border min-h-[600px] shadow-md">
                        <div className="border-b border-gray">
                            <p className="text-2xl font-normal p-6">Tổng quan khoá học</p>
                        </div>
                        <div className="flex-1 flex-col p-8 laptop:flex laptop:gap-4">
                            <p>
                                Trang tổng quan khóa học của bạn rất quan trọng đối với thành công của bạn trên Utemy.
                                Khi bạn hoàn thành phần này, hãy nghĩ đến việc tạo Trang tổng quan khóa học hấp dẫn thể
                                hiện lý do ai đó muốn ghi danh khóa học của bạn.
                            </p>
                            <div className="flex justify-center items-center gap-10 laptop:items-start laptop:justify-start my-4">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="text-center tablet:text-start">
                                            <p className="text-lg font-medium">
                                                Tải lên hình ảnh bìa của khoá học tại đây
                                            </p>
                                            <p className={`${errorImage ? "text-red-500" : ""}  italic`}>
                                                Lưu ý: Kích cỡ nhỏ hơn 4MB, phải là file .jpg .jpeg .png
                                            </p>
                                        </div>
                                        <input
                                            name="thumbnail"
                                            type="file"
                                            accept=".png, .jpg"
                                            className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                onChangeInputThumbnailFile(event);
                                            }}
                                        />
                                    </div>
                                    <img
                                        ref={imageRef}
                                        src={`${courseDetail.thumbnail}`}
                                        alt={courseDetail.title}
                                        className="w-60 h-60 rounded-lg outline-none border border-dashed border-black tablet:w-80 tablet:h-80 laptop:h-96 laptop:w-96"
                                    />
                                </div>

                                <div className="flex flex-col gap-3" style={{ marginLeft: "0px" }}>
                                    <div className="text-center tablet:text-start">
                                        <p className="text-lg font-medium">Chọn video trailer</p>
                                        <p className={`${errorTrailer ? "text-red-500" : ""}  italic`}>
                                            Lưu ý: Kích cỡ video nhỏ hơn 100MB, phải là file .mp4 .mkv .mov
                                        </p>
                                    </div>
                                    <input
                                        name="trailer"
                                        type="file"
                                        accept=".mp4, .mkv, .mov"
                                        className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            onChangeInputTrailerFile(event);
                                        }}
                                    />

                                    {/* Video player */}
                                    {courseDetail.url_trailer != null && (
                                        <video ref={trailerRef} controls className="mt-2" width="640" height="480">
                                            {["video/mp4", "video/x-matroska", "video/mov"].map((type, index) => (
                                                <source
                                                    key={index}
                                                    src={courseDetail.url_trailer ? courseDetail.url_trailer : ""}
                                                    type={type}
                                                />
                                            ))}
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </div>
                            {/* chừng thêm video quảng cáo ở đây nữa */}
                            <Formik
                                initialValues={initialValue}
                                validationSchema={editCourseValidationSchema}
                                onSubmit={handleOnSubmit}
                            >
                                {(formik) => (
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="mt-4 laptop:mt-0 flex-1 flex flex-col border-black bg-background"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-0">
                                            <div className="flex-1 flex flex-col ">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Tên khóa học
                                                </label>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full  ${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-10 shrink-0 mb-2">
                                            <div>
                                                <label
                                                    htmlFor="categories"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Danh mục
                                                </label>
                                                <div
                                                    className={`${
                                                        formik.errors.categories && formik.touched.categories
                                                            ? "border-error"
                                                            : ""
                                                    } rounded-md mt-1`}
                                                >
                                                    <Field
                                                        id="categories"
                                                        name="categories"
                                                        component={CustomeSelect}
                                                        handleOnchange={(e: any) => handleChangeCategories(e, formik)}
                                                        options={categoriesOptions}
                                                        placeholder={"Chọn danh mục"}
                                                        isMulti={true}
                                                        defautlValues={chosenOptionsCategories}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                                <ErrorMessage
                                                    name="categories"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <label
                                                    htmlFor="price"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Giá
                                                </label>
                                                <Field
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    className={`px-2 py-4 border-[1px] outline-none w-full rounded-lg ${
                                                        formik.errors.price && formik.touched.price
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="price"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="summary"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Tóm tắt
                                            </label>
                                            <Field
                                                id="summary"
                                                name="summary"
                                                type="text"
                                                className={`px-2 py-4 border-[1px] outline-none w-full rounded-lg ${
                                                    formik.errors.summary && formik.touched.summary
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="summary"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col h-[400px]">
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
                                                id="description"
                                                as="textarea"
                                                name="description"
                                                component={TextEditor}
                                                description={courseDetail.description}
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
                                        <div className="flex justify-end mt-20">
                                            <button
                                                className={`text-white btn btn-info hover:opacity-75  text-lg  `}
                                                disabled={isLoading}
                                                type="submit"
                                            >
                                                {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                                {isLoading ? "Loading..." : "Lưu"}
                                            </button>
                                            <button
                                                className="btn text-lg ml-2 "
                                                type="submit"
                                                onClick={() => navigate(`/lecturer/course-detail/${courseDetail.slug}`)}
                                                disabled={isLoading}
                                            >
                                                Xem trước khoá học
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default EditForm;
