import React from "react";
// import { Category } from "../../types/course";
import { useNavigate } from "react-router";
import { User } from "../../../types/user";
import { Category } from "../../../types/category";

interface BlogCardProps {
    blogId: number;
    image_blog: string;
    title: string;
    author: User;
    is_published: boolean;
    categories: Category[];
}

const BlogCard: React.FC<BlogCardProps> = (props) => {
    const navigate = useNavigate();
    return (
        <div
            className="rounded-lg bg-background shadow-lg flex flex-col hover:scale-95 hover:duration-300 cursor-pointer w-[200px]"
            onClick={() => navigate(`/blog-detail/${props.blogId}`)}
        >
            <img
                src={props.image_blog}
                alt={props.title}
                className="w-full h-[140px] rounded-t-lg bg-black object-cover"
            />
            <div className="p-4 flex-1 flex flex-col items-start">
                <h2 className="font-bold text-title text-lg  whitespace-wrap line-clamp-2">{props.title}</h2>
                <div className="items-end">
                    <div className="font-medium mt-1">{props.author.first_name + " " + props.author.last_name}</div>
                    <div className="categori flex flex-wrap gap-1">
                        {props.categories &&
                            props.categories.map((category: any) => (
                                <div key={category.category_id} className="mt-1 badge badge-outline">
                                    {category.title}
                                </div>
                            ))}
                    </div>
                    <div className="font-medium mt-1">{props.is_published ? "Đã xuất bản" : "Chưa xuất bản"}</div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
