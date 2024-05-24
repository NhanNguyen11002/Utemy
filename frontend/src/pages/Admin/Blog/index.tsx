import React, { useState, useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { blogActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import SearchIcon from "../../../assets/icons/SeacrchIcon";
import Loading from "../../Loading";
import BlogCard from "./BlogCard";
const BlogAdmin = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState("");
    // const [blogId, setBlogId] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const blogs = useAppSelector((state) => state.blogSlice.blogs);
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
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
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem("");
    };
    useEffect(() => {
        dispatch(blogActions.getBlogsWithPagination({ searchItem, pageIndex }));
    }, [dispatch, searchItem, pageIndex]);

    return (
        <>
            {isGetLoading && <Loading />}
            {/* minhscreen */}
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2">
                <div className="w-3/4 px-10 mb-5 flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                    <div className="flex justify-between w-full">
                        <div className="w-3/4 mx-auto">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Từ khóa..."
                                    className="rounded-full py-4 px-10 w-full border-[1px] border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
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
                            Làm mới
                        </button>{" "}
                    </div>
                    <button
                        // onClick={}
                        className="relative btn-info btn btn-outline  text-xl font-w hover:text-white text-white"
                    >
                        <span className="left-1/2 top-1/2 ">Thêm</span>{" "}
                    </button>{" "}
                </div>
                {blogs.length === 0 ? (
                    <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy blog</p>
                ) : (
                    <p className="mt-4 text-2xl text-center font-bold">Có {totalRecord} blog được tìm thấy </p>
                )}
                <div className="flex-1  my-1  w-3/4 px-10 justify-start">
                    <div className="grid grid-cols-1 tablet:grid-cols-5 gap-4">
                        {blogs.map((blog, index) => {
                            return (
                                <div className="w-full my-1 max-w-xs tablet:max-w-full" key={index}>
                                    <BlogCard
                                        blogId={blog.blog_id}
                                        image_blog={blog.url_image}
                                        title={blog.title}
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
                                        is_published={blog.is_published}
                                        categories={blog.categories}
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
        </>
    );
};

export default BlogAdmin;
