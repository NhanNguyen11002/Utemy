import React, { useEffect } from "react";
import InCartCourse from "./InCartCourse";
import OutCartCourse from "./OutCartCourse";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { cartActions, invoiceActions } from "../../redux/slices";
import { toast } from "react-hot-toast";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

const getPercentDiscount = (subTotal: number, subTotalRetail: number) => {
    return Math.ceil((subTotal / subTotalRetail) * 100);
};
const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const carts = useAppSelector((state) => state.cartSlice.userCart);
    const subTotal = useAppSelector((state) => state.cartSlice.subTotal);
    const subTotalRetail = useAppSelector((state) => state.cartSlice.subTotalRetail);
    const isGetLoading = useAppSelector((state) => state.cartSlice.isGetLoading);
    const discount = useAppSelector((state) => state.cartSlice.discount) || 0;
    const handleCheckout = () => {
        dispatch(invoiceActions.createInvoice()).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload?.message);
                navigate("/checkout");
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const handleRemoveFromCart = (cartDetailId: number) => {
        dispatch(cartActions.removeCourseFromCart(cartDetailId)).then((response) => {
            if (response.payload?.status_code === 200) {
                dispatch(cartActions.getAllCart());
                toast.success(response.payload.message);
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const handleChangeSaveForLater = (cartDetailId: number) => {
        dispatch(cartActions.changeSaveForLater(cartDetailId)).then((response) => {
            if (response.payload?.status_code === 200) {
                dispatch(cartActions.getAllCart());
                toast.success(response.payload.message);
            } else {
                if (response.payload) toast.error(response.payload?.message);
            }
        });
    };
    const getDiscount = (code: string) => {
        setTimeout(() => {
            dispatch(cartActions.getDiscount(code));
        }, 3000);
    };
    useEffect(() => {
        dispatch(cartActions.getAllCart());
        // dispatch(cartAction.getAllCoupon());
    }, [dispatch]);
    let count = 0;
    return (
        <>
            <div className="hidden  w-full h-[80px] bg-background mt-[100px] laptop:flex"></div>
            <div className=" flex flex-col laptop:flex-row ">
                <div className="w-full flex flex-col  h-fit gap-4 ">
                    <div className="w-full flex flex-col  h-fit gap-4 p-4 ">
                        <p className="text-black font-OpenSans text-2xl">Giỏ hàng của tôi</p>
                        {carts.cart_items.map((cartItem) => {
                            if (!cartItem.saved_for_later) {
                                count += 1;
                                return (
                                    <InCartCourse
                                        cartItem={cartItem}
                                        handleChangeSaveForLater={handleChangeSaveForLater}
                                        handleRemoveFromCart={handleRemoveFromCart}
                                    />
                                );
                            }
                        })}
                        {carts.cart_items.length === 0 && (
                            <div className="gap-2 flex items-center">
                                <AcademicCapIcon className="w-6 h-6" />
                                <p className="text-black font-OpenSans font-bold text-2xl">
                                    <a href="/all-courses" className="hover:cursor-pointer underline text-lightblue">
                                        Thêm một vài khóa học
                                    </a>{" "}
                                    vào giỏ hàng và bắt đầu hành trình chinh phục tri thức
                                </p>
                                <AcademicCapIcon className="w-6 h-6" />
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col h-fit gap-4 p-4">
                        {carts.cart_items.some((cartItem) => cartItem.saved_for_later) && (
                            <>
                                <p className="text-black font-OpenSans text-2xl">Để dành sau</p>
                                {carts.cart_items.map((cartItem) => {
                                    if (cartItem.saved_for_later) {
                                        return (
                                            <OutCartCourse
                                                cartItem={cartItem}
                                                handleChangeSaveForLater={handleChangeSaveForLater}
                                                handleRemoveFromCart={handleRemoveFromCart}
                                            />
                                        );
                                    }
                                    return null; // Bỏ qua các phần tử không được lưu để mua sau
                                })}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-2/3 h-fit gap-4 p-4">
                    <p className="text-black font-OpenSans text-2xl">Tổng kết đơn hàng</p>
                    <div className="flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm">
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600">Tạm tính ({count} khóa học)</p>
                            {subTotal < subTotalRetail ? (
                                <div>
                                    <p className="text-end text-lightblue text-2xl font-bold">
                                        {subTotal.toLocaleString()}đ{" "}
                                        <span className="text-gray-600 font-normal text-sm line-through">
                                            {subTotalRetail.toLocaleString()}đ
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm font-normal text-end">
                                        {getPercentDiscount(subTotal, subTotalRetail)}% giảm
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-end text-gray-600 text-2xl font-bold">
                                        {subTotalRetail.toLocaleString()}đ
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-row items-center justify-between">
                            <p className="text-gray-600">Mã giảm giá</p>
                            <input
                                type="text"
                                onChange={(e) => {
                                    getDiscount(e.target.value);
                                }}
                                placeholder="Tùy chọn..."
                                className="input input-bordered input-info input-md w-full max-w-xs"
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600 text-3xl font-bold">Tổng cộng</p>
                            <div>
                                <p className="text-end text-lightblue text-3xl font-bold">
                                    {discount
                                        ? (subTotal * (1 - discount)).toLocaleString()
                                        : subTotal.toLocaleString()}
                                    đ
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="transition-colors text-center text-sm bg-bluelogo hover:bg-background hover:text-bluelogo hover:border-bluelogo hover:border p-2 rounded-sm w-full text-white text-hover shadow-md"
                                onClick={handleCheckout}
                                aria-disabled={isGetLoading}
                            >
                                <span>{isGetLoading ? "LOADING..." : "THANH TOÁN"}</span>
                            </button>
                            <Link
                                className="transition-colors text-center text-sm bg-white border hover:text-white hover:bg-gray-600 border-gray-600  p-2 rounded-sm w-full text-gray-700 text-hover shadow-md"
                                to="/all-courses"
                                aria-disabled={isGetLoading}
                            >
                                <span>QUAY LẠI DANH SÁCH KHÓA HỌC</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden  w-full h-[10px] bg-background mt-[100px] laptop:flex"></div>
        </>
    );
};

export default Cart;
