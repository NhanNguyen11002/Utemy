import React, { useState } from "react";
// import { Category } from "../../types/course";
import { User } from "../../types/user";
// import { Category } from "../../../types/category";
import { ChevronDown, ChevronUp, EyeIcon } from "lucide-react";
import { UtemyNoText } from "../../assets/images";
import { Blog } from "../../types/blog";
import { convertDateFormat } from "../../utils/helper";
import { Link } from "react-router-dom";
// import { Avatar } from "../../../components/ui/avatar";

interface BlogCardLongProps {
    blog: Blog;
    author: User;
    isAdmin: boolean;
}

const BlogCardLong: React.FC<BlogCardLongProps> = (props) => {
    const [hovered, setHovered] = useState(false);
    return (
        <Link to={`${props.isAdmin ? `/admin/blog/edit/${props.blog.slug}` : `/blog/detail/${props.blog.slug}`}`}>
            <div
                className=" bg-background  flex  cursor-pointer w-full h-fit my-5"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img
                    src={props.blog.url_image}
                    alt={props.blog.title}
                    className="w-[200px] h-auto bg-black object-cover "
                />
                <div className="px-4 flex-1 gap-2 flex flex-col justify-between items-start">
                    <h2
                        className={` font-semibold text-2xl h-8 whitespace-wrap transition-all duration-300 line-clamp-1 ${hovered ? "text-info" : ""}`}
                    >
                        {props.blog.title}
                    </h2>

                    <div className="flex gap-2 items-center">
                        <img
                            src={props.author.url_avatar || UtemyNoText}
                            alt="avt-admin"
                            className="rounded-full w-10 h-10 border border-gray-400"
                        />
                        <div className=" font-normal ">{props.author.first_name + " " + props.author.last_name}</div>
                        <div className="border-t border-1 mt-[2px] border-gray-300 w-[30px]"></div>
                        <p className="text-sm text-gray-500">{convertDateFormat(props.blog.updated_at as string)}</p>
                        {props.isAdmin && (
                            <div className={`badge badge-outline ${props.blog.is_published && "badge-info"} text-xs`}>
                                {props.blog.is_published ? "Hiện" : "Ẩn"}
                            </div>
                        )}
                    </div>
                    <div className=" h-5 flex flex-wrap justify-between w-full">
                        <div className="flex flex-wrap gap-1">
                            {props.blog.categories &&
                                props.blog.categories.map((category: any) => (
                                    <div key={category.id} className="mt-1 badge badge-outline">
                                        {category.title}
                                    </div>
                                ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 shrink-0">
                                <EyeIcon className="w-4 h-4" />
                                <p>{props.blog.view}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <ChevronUp className="w-4 h-4" />
                                <p>{props.blog.like}</p>
                            </div>
                            {props.isAdmin && (
                                <div className="flex items-center gap-1 shrink-0">
                                    <ChevronDown className="w-4 h-4" />
                                    <p>{props.blog.dislike}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className={`p-4 flex-1 flex items-center justify-between  `}>
                    <div className="flex items-center">
                        <p className={`${hovered ? "underline underline-offset-8" : ""} `}>Chi tiết</p>
                        <ArrowRight
                            className={`w-4 h-4 transition-all  duration-300 ${hovered ? "translate-x-2" : ""}`}
                        />
                    </div>
                </div> */}
            </div>
        </Link>
    );
};

export default BlogCardLong;
