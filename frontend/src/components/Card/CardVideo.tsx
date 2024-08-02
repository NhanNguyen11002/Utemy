import React from "react";
// import { Category } from "../../types/course";
import { useNavigate } from "react-router";
import { User } from "../../types/user";
import { TotalRating } from "..";
import { Category } from "../../types/category";

interface CardVideoProps {
    for: string;
    courseId: number;
    thumbnail: string;
    title: string;
    author: User;
    rating: number;
    categories: Category[];
    slug?: string;
    price: number;
    salePrice?: number;
    saleUntil?: string;
}

const CardVideo: React.FC<CardVideoProps> = (props) => {
    const ratingId = `${props.courseId}${props.for === "rate" ? "1" : "2"}`;
    const navigate = useNavigate();
    const hasPrice = props.price || props.price === 0;
    const hasSalePrice =
        props.salePrice &&
        props.price &&
        props.salePrice < props.price &&
        props.saleUntil &&
        new Date(props.saleUntil) > new Date();
    return (
        <div
            className="rounded-lg bg-background shadow-lg flex flex-col hover:scale-95 hover:duration-300 cursor-pointer h-fit w-[200px]"
            onClick={() => navigate(`/course-detail/${props.slug}`)}
        >
            <img
                src={props.thumbnail}
                alt={props.title}
                className="w-full h-[140px] rounded-t-lg bg-black object-cover"
            />
            <div className="p-4 flex-1 flex flex-col items-start">
                <h2 className="font-bold text-title text-lg h-21 whitespace-wrap line-clamp-3">{props.title}</h2>
                <div className="items-end">
                    <div className="font-medium mt-1">{props.author.first_name + " " + props.author.last_name}</div>
                    <div className="font-medium mt-1">
                        {props.rating}{" "}
                        <TotalRating ratingId={Number(ratingId)} isForCourse={false} totalScore={props.rating} />
                    </div>
                    <div className="categori flex flex-wrap gap-[2px] h-14 overflow-hidden">
                        {props.categories &&
                            props.categories.map((category: any) => (
                                <div
                                    key={category.category_id}
                                    className="mt-1 max-w-[100px] truncate badge badge-outline"
                                >
                                    {category.title}
                                </div>
                            ))}
                    </div>
                    <div>
                        {hasPrice &&
                            (hasSalePrice ? (
                                <p className="text-base font-bold">
                                    Giá:
                                    <span className=" font-extrabold font-OpenSans text-lightblue ">
                                        {" "}
                                        {props.salePrice?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                    <span className="font-normal italic text-xs line-through">
                                        {" "}
                                        {props.price?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                </p>
                            ) : (
                                <p className="text-base font-bold">
                                    Giá:
                                    <span className="font-extrabold font-OpenSans">
                                        {" "}
                                        {props.price?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                </p>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardVideo;
