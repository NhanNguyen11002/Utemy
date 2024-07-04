import React from "react";
// import { Category } from "../../types/course";
import { useNavigate } from "react-router";
import { User } from "../../types/user";
import { TotalRating } from "../../components";
import { Category } from "../../types/category";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { convertDateFormat } from "../../utils/helper";
import { CheckIcon, SparklesIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { cartActions } from "../../redux/slices";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as HoverCard from "@radix-ui/react-hover-card";

interface CardVideoNewProps {
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
    updatedAt?: Date;
    summary: string;
    study: any;
}

const CardVideoNew: React.FC<CardVideoNewProps> = (props) => {
    const study = typeof props.study === typeof [] ? props.study : JSON.parse(props.study);
    const ratingId = `${props.courseId}${props.for === "rate" ? "1" : props.for === "enrolled" ? "2" : "3"}`;
    const navigate = useNavigate();
    const hasPrice = props.price || props.price === 0;
    const hasSalePrice =
        props.salePrice &&
        props.price &&
        props.salePrice < props.price &&
        props.saleUntil &&
        new Date(props.saleUntil) > new Date();
    const [hovered, setHovered] = useState(false);

    //
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector((state) => state?.authSlice?.isLogin) ?? false;
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const isAuthor = props.author.user_id === useAppSelector((state) => state.authSlice.user.user_id);
    const isInCart =
        useAppSelector((state) => state.cartSlice.userCart.cart_items).findIndex(
            (e) => e.course.course_id === props.courseId,
        ) !== -1;
    const isEnrolled = useAppSelector((state) => state.courseSlice.myEnrolled)[props.courseId] !== undefined;
    const handleGetItClick = () => {
        if (!isLogin || isInCart) {
            return;
        } else {
            dispatch(cartActions.addCourseToCart(Number(props.courseId))).then((response) => {
                if (response.payload?.status_code === 200) {
                    dispatch(cartActions.getAllCart());
                    toast.success(response.payload.message);
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        }
    };
    return (
        <>
            <HoverCard.Root openDelay={100} closeDelay={0}>
                <HoverCard.Trigger>
                    <div
                        className="rounded-lg bg-background shadow-lg flex flex-col cursor-pointer w-[250px]"
                        onClick={() => navigate(`/course-detail/${props.slug}`)}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <img
                            src={props.thumbnail}
                            alt={props.title}
                            className={` w-full h-[140px] rounded-t-lg bg-black object-cover ${hovered ? "brightness-90" : ""}`}
                        />
                        <div className="p-4 flex-1 flex flex-col items-start">
                            <h2 className="font-bold text-title text-lg h-[84px] line-clamp-3">{props.title}</h2>
                            <div className="items-end">
                                <div className="font-medium mt-1">
                                    {props.author.first_name + " " + props.author.last_name}
                                </div>
                                <div className="font-medium mt-1">
                                    {props.rating}{" "}
                                    <TotalRating
                                        ratingId={Number(ratingId)}
                                        isForCourse={false}
                                        totalScore={props.rating}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-[2px] h-14 overflow-hidden ">
                                    {props.categories &&
                                        props.categories.map((category: any) => (
                                            <div
                                                key={category.category_id}
                                                className="badge badge-outline truncate text-end max-w-[100px]"
                                            >
                                                {category.title}
                                            </div>
                                        ))}
                                </div>
                                <div>
                                    {hasPrice &&
                                        (hasSalePrice ? (
                                            <p className="text-base font-bold">
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
                </HoverCard.Trigger>
                <HoverCard.Portal>
                    <HoverCard.Content hideWhenDetached={true} side="right" className=" HoverCardContent">
                        <div>
                            <p className="text-2xl font-semibold">{props.title}</p>
                            {props.updatedAt && (
                                <p className="text-lightblue text-xs font-semibold">
                                    Last updated: {convertDateFormat(props.updatedAt.toString())}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-ligh">{props.summary}</p>
                            <ul>
                                {study &&
                                    study.length > 0 &&
                                    study.slice(0, 3).map((study: string) => (
                                        <li className="text-base font-light" key={study}>
                                            <div className="flex gap-1 items-start shrink-0">
                                                <CheckIcon className="w-4 h-4 shrink-0" />
                                                <p className="text-base">{study}</p>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            <Link to={`${isLogin ? (isInCart ? "/cart" : "") : "/signup"}`} className="self-center">
                                {isAuthor ? (
                                    <Button disabled className="">
                                        <span>Đây là khoá học của bạn</span>
                                        <SparklesIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : isEnrolled ? (
                                    <Button disabled className="">
                                        <span>Bạn đã đăng ký khoá học này</span>
                                        <SparklesIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleGetItClick}>
                                        <span>
                                            {isGetLoading
                                                ? "Loading..."
                                                : isInCart
                                                  ? "Tới giỏ hàng"
                                                  : "Thêm vào giỏ hàng"}
                                        </span>
                                        <ShoppingCartIcon className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </Link>
                        </div>
                        <HoverCard.Arrow className="fill-white" />
                    </HoverCard.Content>
                </HoverCard.Portal>
            </HoverCard.Root>
        </>
    );
};

export default CardVideoNew;
