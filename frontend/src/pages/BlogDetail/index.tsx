import React, { useEffect, useRef, useState } from "react";
import { Spin, CarouselBlogRelated } from "../../components";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { useNavigate, useParams, Link } from "react-router-dom";
import { blogActions } from "../../redux/slices";
import { UtemyNoText } from "../../assets/images";
import { convertDateFormat } from "../../utils/helper";
import { TriangleIcon, EyeIcon } from "lucide-react";
import ShareButton from "./ShareButton";
const BlogDetail: React.FC = () => {
    const navigate = useNavigate();
    const authorRef = useRef<any>(null);
    const bottomAuthorRef = useRef<any>(null);
    const contentRef = useRef<any>(null);
    const { slug } = useParams();
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    const dispatch = useAppDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const top5Related = useAppSelector((state) => state.blogSlice.relatedBlogs) || [];
    const currentReact = useAppSelector((state) => state.blogSlice.currentBlogReact) || "";

    useEffect(() => {
        dispatch(blogActions.getBlog(slug as string)).then((response: any) => {
            if (response.payload && response.payload.status_code !== 200) navigate("/404");
            else {
                dispatch(blogActions.top5RelatedBySlug(slug as string));
                if (isLogin) {
                    dispatch(blogActions.getUserReactBySlug(slug as string));
                }
            }
        });
    }, [dispatch, slug]);

    const isMiddle = (el: any) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight / 3;
    };
    const isBottom = (el: any) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    };
    const isBetweenBotAndMiddle = (el: any) => {
        return el.getBoundingClientRect().bottom <= (window.innerHeight * 2) / 3;
    };
    const trackScrolling = () => {
        const topAuthor = authorRef.current;
        const bottomAuthor = bottomAuthorRef.current;
        if (isMiddle(topAuthor)) {
            setIsVisible(true);
        } else setIsVisible(false);

        if (isBetweenBotAndMiddle(bottomAuthor)) setIsVisible(false);
        else setIsVisible(true);
    };
    const trackViewIncrease = () => {
        const contentElement = contentRef.current;
        if (isBottom(contentElement)) {
            window.removeEventListener("scroll", trackViewIncrease);
            dispatch(blogActions.increaseViewBlog(slug as string));
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", trackScrolling);
        window.addEventListener("scroll", trackViewIncrease);

        return () => {
            window.removeEventListener("scroll", trackScrolling);
            window.removeEventListener("scroll", trackViewIncrease);
        };
    }, []);
    const stage = process.env.REACT_APP_ENV;
    const handleReact = (isLike: boolean) => {
        if (!isLogin) {
            navigate("/login");
            return;
        }
        dispatch(blogActions.reactBlog({ blog_id: blog.blog_id, reaction_type: isLike ? "like" : "dislike" }));
    };

    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full min-h-[600px] mb-20 relative">
                <div
                    className={`fixed  w-[100px] h-[300px] top-1/4 laptop:left-[20%] transition-all duration-300 ${isVisible ? "" : "opacity-0"}`}
                >
                    <div className="w-full h-full items-center flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                            <TriangleIcon
                                onClick={() => handleReact(true)}
                                className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${currentReact === "like" && "text-info"}`}
                            />
                            <p className="text-xl">{blog.like}</p>
                            <TriangleIcon
                                onClick={() => handleReact(false)}
                                className={`w-6 h-6 rotate-180 cursor-pointer hover:text-info duration-300 transition-all ${currentReact === "dislike" && "text-info"}`}
                            />
                        </div>
                        <img
                            src={blog.author.url_avatar || UtemyNoText}
                            alt="avt-admin"
                            className="rounded-full w-10 h-10 border border-gray-400"
                        />
                        <div className="flex flex-col items-center">
                            <EyeIcon className="w-6 h-6 " />
                            <p className="text-xl">{blog.view}</p>
                        </div>
                        {stage === "production" && <ShareButton />}
                    </div>
                </div>
                <div id="pivot" className="flex flex-col gap-5 items-start max-w-[800px] h-fit mx-auto relative">
                    <div className="bg-background p-10 ql-snow flex flex-col gap-5 ">
                        <div className="flex gap-1 mx-4 mb-2">
                            {blog.categories.length > 0 &&
                                blog.categories.map((category) => {
                                    return (
                                        <Link
                                            key={category.category_id}
                                            to={`/blog/category/${category.category_id}`}
                                            className="text-sm hover:underline hover:cursor-pointer underline-offset-1 font-semibold text-gray-500"
                                        >
                                            {category.title}
                                        </Link>
                                    );
                                })}
                        </div>
                        <p className="text-5xl font-semibold mx-4">{blog.title}</p>
                        <div id="author_info" ref={authorRef} className="flex gap-2 items-center mx-4">
                            <img
                                src={blog.author.url_avatar || UtemyNoText}
                                alt="avt-admin"
                                className="rounded-full w-14 h-14 border border-gray-400"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm  font-normal ">
                                    {blog.author.first_name + " " + blog.author.last_name}
                                </p>
                                <p className="text-sm text-gray-500 font-normal ">
                                    {convertDateFormat(blog.updated_at as string)}
                                </p>
                            </div>
                        </div>
                        <div className="blog-content">
                            <img src={blog.url_image} alt="thumbnail" className="" />
                        </div>
                        <div
                            ref={contentRef}
                            className="ql-editor blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></div>
                        <div ref={bottomAuthorRef} className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src={blog.author.url_avatar || UtemyNoText}
                                    alt="avt-admin"
                                    className="rounded-full w-14 h-14 border border-gray-400"
                                />
                                <div className="flex flex-col">
                                    <p className="text-sm  font-normal ">
                                        {blog.author.first_name + " " + blog.author.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500 font-normal ">
                                        {convertDateFormat(blog.updated_at as string)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <TriangleIcon
                                    onClick={() => handleReact(true)}
                                    className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${currentReact === "like" && "text-info"}`}
                                />
                                <p className="text-xl">{blog.like}</p>
                                <TriangleIcon
                                    onClick={() => handleReact(false)}
                                    className={`w-6 h-6 rotate-180 cursor-pointer hover:text-info duration-300 transition-all ${currentReact === "dislike" && "text-info"}`}
                                />
                                {stage === "production" && <ShareButton />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" container">
                    {top5Related.length > 0 && <CarouselBlogRelated blogs={top5Related} />}
                </div>
            </div>
        </>
    );
};

export default BlogDetail;
