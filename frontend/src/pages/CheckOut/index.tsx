import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import toast from "react-hot-toast";
import { invoiceActions, vnpayActions } from "../../redux/slices";
// import { useNavigate } from "react-router-dom";
import { Spin } from "../../components";
import { getCouponByCode, setCouponNull } from "../../redux/slices/cart.slice";
import { useNavigate } from "react-router-dom";
function Checkout() {
    const navigate = useNavigate();
    const [method, setMethod] = useState("");
    // const navigate = useNavigate();
    const [error, setError] = useState(false);
    const dispatch = useAppDispatch();
    const invoice = useAppSelector((state) => state.invoiceSlice.invoice);
    const isGetLoading = useAppSelector((state) => state.invoiceSlice.isGetLoading);
    const coupon = useAppSelector((state) => state.cartSlice.coupon);
    useEffect(() => {
        if (coupon) {
            dispatch(getCouponByCode(coupon.code)).then((response) => {
                if (response.payload?.status_code == 404) {
                    toast.error("Mã coupon của bạn vừa chọn đã hết hạn hoặc hết số lượng, vui lòng kiểm tra lại");
                    navigate("/cart");
                }
            });
            dispatch(setCouponNull());
        }
    }, [dispatch]);
    // useEffect(() => {
    //     dispatch(getCouponByCode(coupon.code)).then((response) => {
    //         if (response.payload?.status_code === 404) {
    //             toast.error("Mã coupon của bạn vừa chọn đã hết hạn hoặc hết số lượng, vui lòng kiểm tra lại");
    //             navigate("/cart",{ state: {fromCheckout: true} });
    //         } else {
    //             dispatch(invoiceActions.getInvoiceNow()).then((response: any) => {
    //                 if (response.payload?.status_code !== 200) navigate("/");
    //             });
    //         }
    //     });
    // }, [dispatch, coupon]);

    const handleChosePaymentMethod = (name: string) => {
        setMethod(name);
    };
    const handleCheckout = async () => {
        if (method === "vnpay") {
            const values = {
                invoice_id: invoice.invoice_id,
                amount: invoice.total_money,
                bank_code: "",
                language: "vn",
            };
            dispatch(vnpayActions.createPaymentUrl(values)).then((response) => {
                if (response.payload?.status_code === 200) window.location.replace(response.payload.data as string);
            });
        } else {
            setError(true);
            toast.error("Please choose payment method");
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    };
    useEffect(() => {
        dispatch(invoiceActions.getInvoiceNow()).then((response: any) => {
            if (response.payload?.status_code !== 200) navigate("/");
        });
    }, [dispatch]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="hidden  w-full h-[20px] bg-background laptop:flex"></div>
            <div className="mt-20"></div>
            <div className="container p-12 mx-auto">
                <div className="flex flex-col w-3/5 px-0 mx-auto md:flex-row">
                    <div className="flex flex-col w-3/5 border-right border-black">
                        <h1 className="mb-4 font-bold md:text-5xl font-OpenSans text-black text-heading ">
                            Thanh toán
                        </h1>
                        <h2 className="text-xl font-bold font-OpenSans text-black">Hóa đơn</h2>
                        <form className="justify-center w-full mx-auto mb-10">
                            <div className="">
                                <div className="space-x-0 lg:flex lg:space-x-4">
                                    <div className="w-full lg:w-1/2">
                                        <label
                                            htmlFor="firstName"
                                            className="block mb-3 text-xl font-semibold text-black"
                                        >
                                            Phương pháp thanh toán
                                        </label>
                                        <div className="form-control border border-black px-2 bg-footer">
                                            <label className="label cursor-pointer">
                                                <span className="label-text">VNPAY</span>
                                                <input
                                                    type="radio"
                                                    name="radio-payment-method"
                                                    value="vnpay"
                                                    className="radio  checked:bg-red-500"
                                                    onChange={(event) => {
                                                        handleChosePaymentMethod(event.target.value);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div>
                            <h2 className="text-xl font-bold font-OpenSans text-black  mb-3">Chi tiết hóa đơn</h2>
                            <div className="flex flex-col space-y-4">
                                {invoice.invoice_items.map((item, index) => {
                                    return (
                                        <div className="flex space-x-4 items-start" key={index}>
                                            <div>
                                                <img
                                                    src={item.course.thumbnail}
                                                    alt={item.course.title}
                                                    className="w-10 h-auto"
                                                />
                                            </div>
                                            <div className="items-start w-full flex flex-row justify-between">
                                                <p className="text-l  font-bold">{item.course.title}</p>
                                                <p className="text-l  font-bold">{item.paid_price.toLocaleString()}đ</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-2/5 h-fit">
                        <div className="pt-12 md:pt-0 2xl:ps-4">
                            <div className="hidden  w-full h-[48px] bg-background laptop:flex"></div>
                            <div className="border border-black py-4 px-5 ">
                                <h2 className="text-xl font-OpenSans  text-black font-bold">Tổng kết hóa đơn</h2>

                                <div className="flex items-center w-full py-4  font-semibold border-b text-xl border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                                    Tổng cộng<span className="ml-2">{invoice.total_money.toLocaleString()}đ</span>
                                </div>
                                <button
                                    className="transition-colors text-center text-xl bg-bluelogo hover:bg-background hover:text-bluelogo hover:border-bluelogo hover:border p-2 rounded-sm w-full text-white text-hover shadow-md"
                                    onClick={handleCheckout}
                                    disabled={isGetLoading || error}
                                >
                                    {" "}
                                    {isGetLoading ? "LOADING..." : "Hoàn tất thanh toán"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;
