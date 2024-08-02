import { useAppSelector } from "../../../hooks/hooks";
import { Link } from "react-router-dom";
import { ArrowLeftSquareIcon } from "lucide-react";
import { UtemyNoText } from "../../../assets/images";

import { convertDateFormat } from "../../../utils/helper";
type BlogReviewProps = {};

const BlogReview: React.FC<BlogReviewProps> = () => {
    const blog = useAppSelector((state) => state.blogSlice.blog);

    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="flex flex-col gap-5 items-start w-[800px] h-fit mx-auto">
                <Link
                    to={`/admin/blog/edit/${blog.slug}`}
                    className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                >
                    <ArrowLeftSquareIcon className="w-5 h-5" />
                    <p className="text-lg">Quay lại chỉnh sửa</p>
                </Link>
                <div className="bg-background p-10 ql-snow flex flex-col gap-5 ">
                    <div className="flex gap-1 mx-4 mb-2">
                        {blog.categories.length > 0 &&
                            blog.categories.map((category) => {
                                return (
                                    <p key={category.category_id} className="text-sm font-semibold text-gray-500">
                                        {category.title}
                                    </p>
                                );
                            })}
                    </div>
                    <p className="text-5xl font-semibold mx-4">{blog.title}</p>
                    <div className="flex gap-2 items-center mx-4">
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
                    <div className="ql-editor blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                </div>
            </div>
        </div>
    );
};

export default BlogReview;
