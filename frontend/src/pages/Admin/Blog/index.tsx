import React, { useState, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { blogActions } from "../../../redux/slices";
import { Pagination, BlogCard } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import logoUtemy from "../../../assets/images/utemy_logo_notext.png";
import Loading from "../../Loading";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../../../components/ui/dialog";
import { Formik, ErrorMessage, Field } from "formik";
import { GetBlogsWithPagination, NewBlog } from "../../../types/blog";
import { Category } from "../../../types/category";
import { previewImage } from "../../../utils/helper";
import { createBlogValidationSchema } from "../../../validations/blog";
// import useQueryParams from "../../../hooks/useQueryParams";
import toast from "react-hot-toast";
import slugify from "slugify";

const BlogAdmin = () => {
    // const { keyword, category } = useQueryParams();
    // let categoryQuery = category;
    // if (typeof categoryQuery === "string") {
    //     categoryQuery = [Number(category)];
    // } else if (typeof categoryQuery === "object") {
    //     categoryQuery = category.map((cate: string) => Number(cate));
    // } else {
    //     categoryQuery = [];
    // }
    const [categoryChecked, setCategoryChecked] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const formikRef = useRef(null);
    const dispatch = useAppDispatch();
    const categoriesList: Category[] = useAppSelector((state) => state.categorySlice.categories);
    const blogs = useAppSelector((state) => state.blogSlice.blogs);
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const handleSingleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
        const { value, checked } = event.target;

        if (checked) {
            setCategoryChecked((pre) => [...pre, categoryId]);
        } else {
            setCategoryChecked((pre) => [...pre.filter((cate) => cate !== Number(value))]);
        }
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSearchItem(userInput);
        setUserInput("");
    };
    const handleFilterBlog = () => {
        const query: GetBlogsWithPagination = {
            pageIndex: pageIndex,
            searchItem: searchItem as string,
            category: categoryChecked,
        };
        dispatch(blogActions.getBlogsWithPagination(query));
    };
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
        setCategoryChecked([]);
        dispatch(blogActions.getBlogsWithPagination({ searchItem, pageIndex }));
    };
    const handleOnSubmit = (values: NewBlog) => {
        console.log("on submit", values);
        const slug = slugify(values.title.toLowerCase());
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("slug", slug);
        formData.append("image_blog", values.image_blog as File);

        dispatch(blogActions.createBlog(formData)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    dispatch(blogActions.getBlogsWithPagination({ searchItem: "", pageIndex: 1 }));
                    dialogClose();
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
    };
    const handleChangeImage = (event: any, formik: any) => {
        // setThumbnail(event.currentTarget.files![0]);
        const image_blog = event.currentTarget.files![0];
        formik.setFieldValue("image_blog", image_blog);
        previewImage(image_blog, imageRef);
    };
    const initialValues = {
        image_blog: null,
        title: "",
    };
    const dialogClose = () => {
        if (closeRef.current) closeRef.current.click();
    };
    useEffect(() => {
        dispatch(blogActions.getBlogsWithPagination({ searchItem, pageIndex, category: categoryChecked }));
    }, [dispatch, searchItem, pageIndex]);

    return (
        <>
            {isGetLoading && <Loading />}
            <Dialog>
                <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2">
                    <div className="w-3/4 px-10 mb-5 flex flex-col gap-4 justify-between items-center shrink-0 tablet:flex-row">
                        <div className="flex justify-between w-full items-center">
                            <div className="w-3/4 mx-auto">
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Từ khóa..."
                                        className="rounded-full py-4 px-10 w-full border-[1px] border-black"
                                        value={userInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setUserInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleKeyWordSearch();
                                        }}
                                    />
                                    <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                        <SearchIcon />
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleReset()} className="text-xl btn btn-outline font-w ">
                                Đặt lại
                            </button>
                        </div>

                        <DialogTrigger>
                            <button className="btn-info btn btn-outline  text-xl font-w hover:text-white text-white">
                                <span className="left-1/2 top-1/2 ">Thêm</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tạo blog mới</DialogTitle>
                                <DialogDescription>
                                    Bạn sẽ tạo blog mới ở đây, bắt đầu với tiêu đề và ảnh bìa
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={createBlogValidationSchema}
                                    onSubmit={handleOnSubmit}
                                    innerRef={formikRef}
                                >
                                    {(formik: any) => (
                                        <form
                                            name="create-blog-form"
                                            className="w-full flex flex-col"
                                            onSubmit={formik.handleSubmit}
                                        >
                                            <div className="w-full">
                                                <div className="flex flex-col w-full">
                                                    <label
                                                        htmlFor="title"
                                                        className="text-sm mb-1 font-medium tablet:text-xl"
                                                    >
                                                        Tiêu đề
                                                    </label>
                                                    <Field
                                                        id="title"
                                                        type="text"
                                                        name="title"
                                                        className={`${
                                                            formik.errors.title && formik.touched.title
                                                                ? "border-error"
                                                                : ""
                                                        } px-2 py-4 rounded-lg border-[1px] outline-none w-full`}
                                                    />
                                                    <ErrorMessage
                                                        name="title"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <div className="">
                                                        <p className="text-base font-medium">Chọn ảnh bìa</p>
                                                        <p className="text-sm italic">
                                                            Kích thước ảnh nhỏ hơn hoặc bằng 4mb
                                                        </p>
                                                    </div>
                                                    <Field
                                                        id="image_blog"
                                                        name="image_blog"
                                                        type="file"
                                                        value={undefined}
                                                        className="file-input file-input-sm file-input-bordered file-input-info w-full max-w-xs"
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            formik.setFieldValue(
                                                                "image_blog",
                                                                event.currentTarget.files![0],
                                                            );
                                                            formik.setFieldError("image_blog", undefined);
                                                            handleChangeImage(event, formik);
                                                        }}
                                                    />
                                                    <ErrorMessage
                                                        name="image_blog"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                    <div className="w-full mx-auto">
                                                        <img
                                                            src={logoUtemy}
                                                            ref={imageRef}
                                                            alt="Thumbnail"
                                                            className=" rounded-lg mr-3 outline-none border border-dashed border-black w-full h-auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 self-end items-center mt-2">
                                                <button
                                                    disabled={isLoading}
                                                    type="submit"
                                                    className=" btn-info btn btn-outline  text-xl font-w"
                                                >
                                                    {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                                    {isLoading ? "Loading..." : "Thêm"}
                                                </button>
                                                <DialogClose id="close_dialog" asChild>
                                                    <button
                                                        ref={closeRef}
                                                        type="button"
                                                        className="btn text-lg ml-2"
                                                        disabled={isLoading}
                                                        onClick={() => {
                                                            formik.resetForm(initialValues);
                                                        }}
                                                    >
                                                        Hủy
                                                    </button>
                                                </DialogClose>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        </DialogContent>
                    </div>

                    <div className="flex">
                        <div className=" w-1/6 ">
                            <button
                                className="btn btn-info btn-outline text-lg mr-1 hover:text-white"
                                onClick={handleFilterBlog}
                            >
                                Áp dụng
                            </button>
                            <h2 className="text-2xl font-bold mb-2">Danh mục</h2>
                            <div className="grid grid-cols-2 laptop:grid-cols-1">
                                {categoriesList.length > 0 &&
                                    categoriesList.map((category) => {
                                        return (
                                            <div className="flex items-center gap-2 mb-1" key={category.category_id}>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-info"
                                                    name={category.title}
                                                    value={category.category_id}
                                                    checked={categoryChecked.includes(category.category_id)}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleSingleCategoryChange(event, category.category_id)
                                                    }
                                                />
                                                <span className="text-xl">{category.title}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className="flex flex-col w-4/5 items-center">
                            {blogs.length === 0 ? (
                                <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy blog</p>
                            ) : (
                                <p className="mt-4 text-2xl text-center font-bold">
                                    Có {totalRecord} blog được tìm thấy{" "}
                                </p>
                            )}
                            <div className="flex-1  my-1  w-full px-10 justify-start">
                                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                                    {blogs.map((blog, index) => {
                                        return (
                                            <div className="w-full my-1 max-w-xs tablet:max-w-full" key={index}>
                                                <BlogCard
                                                    blog={blog}
                                                    author={{
                                                        first_name: blog.author?.first_name || "",
                                                        last_name: blog.author?.last_name || "",
                                                        email: blog.author?.email || "",
                                                        url_avatar: blog.author?.url_avatar || undefined,
                                                        user_id: blog.author?.user_id || undefined,
                                                        description: blog.author?.description || "",
                                                        is_admin: blog.author?.is_admin || undefined,
                                                        is_delete: blog.author?.is_delete || undefined,
                                                        created_at: blog.author?.created_at || undefined,
                                                    }}
                                                    isAdmin={true}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                {totalPage > 1 && (
                                    <div className="flex justify-end my-4">
                                        <Pagination
                                            handleChangePageIndex={handleChangePageIndex}
                                            totalPage={totalPage}
                                            currentPage={pageIndex}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default BlogAdmin;
