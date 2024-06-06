import React, { useEffect, useState, useRef } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import { editBlogValidationSchema } from "../../../validations/blog";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { CustomeSelect, TextEditorWithImage } from "../../../components";
import { categoryActions, blogActions } from "../../../redux/slices";
import { Blog, EditBlog } from "../../../types/blog";
import { Category as CategoryType } from "../../../types/category";
import toast from "react-hot-toast";
import { previewImage } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
// import { Prompt } from "react-router-dom"

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
type props = {};

const EditTab: React.FC<props> = (props) => {
    const formikRef = useRef<any>(null);
    const navigate = useNavigate();
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
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
    const blog: Blog = useAppSelector((state) => state.blogSlice.blog);
    const blogId = blog.blog_id;
    const blogCategories = blog.categories; // danh sach cac category cua course
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const imageRef = useRef<HTMLImageElement>(null);
    const chosenOptionsCategories: Options[] = [];
    blogCategories.forEach((category: CategoryType) => {
        const temp: Options = {
            value: category.category_id,
            label: category.title,
        };
        chosenOptionsCategories.push(temp);
    });

    const initialValue: EditBlog = {
        title: blog.title,
        categories: chosenOptionsCategories,
        content: blog.content,
        image_blog: null,
    };
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch, blogId]);
    useEffect(() => {
        // lọc đưa các category chưa được chọn vào box
        let createTemp = [...blogCategories];
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
    }, [blogCategories, categories]);

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
            previewImage(thumbnail, imageRef, blog.url_image);
        }
    };

    const handleOnSubmit = (values: EditBlog) => {
        const categories = values.categories.map((item: any) => item.value);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("blog_id", blog.blog_id.toString());
        formData.append("content", values.content);
        formData.append("categories", categories.toString());
        formData.append("image_blog", thumbnail as File);
        console.log(formData);
        dispatch(blogActions.updateBlog(formData)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(blogActions.getBlog(blog.slug));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const handleChangeContent = (content: string, formik: any) => {
        formik.setFieldValue("content", content);
    };

    return (
        <>
            {isGetLoading !== true && (
                <>
                    <div className="w-full border min-h-[600px] shadow-md">
                        <div className="border-b border-gray">
                            <p className="text-2xl font-normal p-6">Tổng quan blog</p>
                        </div>
                        <div className="flex-1 flex-col p-8 laptop:flex laptop:gap-4">
                            <p>
                                Bạn có thể thực hiện chỉnh sửa nội dung, tiêu đề, thể loại của bài blog. Khi blog đã
                                hoàn thành, bạn có thể qua tab trạng thái blog để thực hiện thay đổi trạng thái của blog
                                (công khai hoặc ẩn)
                            </p>
                            <div className="flex justify-center items-center gap-10 laptop:items-start laptop:justify-start my-4">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="text-center tablet:text-start">
                                            <p className="text-lg font-medium">Tải lên hình ảnh bìa của blog tại đây</p>
                                            <p className={`${errorImage ? "text-red-500" : ""}  italic`}>
                                                Lưu ý: Kích cỡ nhỏ hơn 4MB, phải là file .jpg .jpeg .png
                                            </p>
                                        </div>
                                        <input
                                            id="image_blog"
                                            name="image_blog"
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
                                        src={`${blog.url_image}`}
                                        alt={blog.title}
                                        className=" rounded-lg outline-none border border-dashed border-black tablet:w-80 tablet:h-80 laptop:h-96 laptop:w-auto"
                                    />
                                </div>
                            </div>
                            {/* chừng thêm video quảng cáo ở đây nữa */}
                            <Formik
                                innerRef={formikRef}
                                initialValues={initialValue}
                                validationSchema={editBlogValidationSchema}
                                onSubmit={handleOnSubmit}
                                enableReinitialize={true}
                            >
                                {(formik) => (
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="mt-4 laptop:mt-0 flex-1 flex flex-col border-black "
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-0">
                                            <div className="flex-1 flex flex-col ">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Tiêu đề
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
                                        <div className="grid grid-cols-1 shrink-0 mb-2">
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
                                        </div>

                                        <div className="flex-1 flex flex-col h-[800px]">
                                            <label
                                                htmlFor="content"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Nội dung
                                            </label>
                                            <br />
                                            <ErrorMessage
                                                name="content"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                            <Field
                                                id="content"
                                                as="textarea"
                                                name="content"
                                                height={700}
                                                component={TextEditorWithImage}
                                                content={blog.content}
                                                handleChangeContent={(content: string) =>
                                                    handleChangeContent(content, formik)
                                                }
                                                className={`${
                                                    formik.errors.content && formik.touched.content
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
                                                type="button"
                                                onClick={() => navigate(`/admin/blog/review/${blog.slug}`)}
                                                disabled={isLoading}
                                            >
                                                Xem trước bài viết
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

export default EditTab;
