import React from "react";
import { CartItem } from "../../types/cart";
import { TotalRating } from "../../components";
type CartCourseProps = {
    cartItem: CartItem;
    handleRemoveFromCart(cartDetailId: number): void;
    handleChangeSaveForLater(cartDetailId: number): void;
};
const InCartCourse: React.FC<CartCourseProps> = (props) => {
    const course = props.cartItem.course;
    const cartDetailId = props.cartItem.cart_detail_id;
    const isCourseSale =
        course.sale_price &&
        course.sale_until &&
        course.price &&
        course.sale_price < course.price &&
        new Date(course.sale_until) > new Date();

    return (
        <>
            <div className="flex flex-col p-4 text-lg font-semibold shadow-md border rounded-sm">
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                    <div className="flex flex-row gap-6 ">
                        <div className="w-28 h-28">
                            <img alt="thumbnail" className="w-full h-full" src={course.thumbnail} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-2xl text-lightblue font-bold">{course.title}</p>
                            <p className="text-xs text-gray-600 font-semibold">
                                Tác giả:{" "}
                                <span className="font-normal">
                                    {course.author?.first_name} {course.author?.last_name}
                                </span>
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">
                                Đánh giá: <span className="font-normal">{course.average_rating} </span>
                                <TotalRating
                                    ratingId={course.course_id}
                                    totalScore={course.average_rating}
                                    isForCourse={false}
                                />
                            </p>
                        </div>
                    </div>

                    <div className=" flex flex-row w-[300px] items-center text-right">
                        <div className="flex flex-col w-2/4 items-start mr-[20px]">
                            <span
                                className="w-full hover:underline hover:cursor-pointer hover:opacity-75"
                                onClick={() => props.handleRemoveFromCart(cartDetailId)}
                            >
                                Xóa
                            </span>
                            <span
                                onClick={() => props.handleChangeSaveForLater(cartDetailId)}
                                className="w-full hover:underline hover:cursor-pointer hover:opacity-75"
                            >
                                Để dành sau
                            </span>
                            <span></span>
                        </div>
                        {isCourseSale ? (
                            <div className="ml-[25px] w-2/4">
                                <p className="text-lightblue font-bold text-2xl">
                                    đ{course.sale_price?.toLocaleString()}
                                </p>
                                <p className="text-gray-600 font-normal text-sm line-through">
                                    đ{course.price?.toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <div className="ml-[25px] w-2/4">
                                <p className="text-gray-600 font-bold text-2xl ">đ{course.price?.toLocaleString()}</p>
                                <p className="text-white font-bold text-sm"> ZZZ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default InCartCourse;
