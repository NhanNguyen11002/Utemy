import React, { useEffect, useState } from "react";
import InCartCourse from "./InCartCourse";
import OutCartCourse from "./OutCartCourse";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { cartActions, couponActions, invoiceActions } from "../../redux/slices";
import { toast } from "react-hot-toast";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import ReCAPTCHA from "react-google-recaptcha";
import CreatableSelect from "react-select/creatable";

const getPercentDiscount = (subTotal: number, subTotalRetail: number) => {
    return 100 - Math.ceil((subTotal / subTotalRetail) * 100);
};
const Cart: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    type OptionType = {
        value: string;
        label: string;
    };
    const voucherDropdown = useAppSelector((state) => state.couponSlice.voucherDropdown);
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    const formattedOptions: OptionType[] = voucherDropdown.map((voucher) => ({
        value: voucher.code,
        label: `${voucher.code} - ${formatDate(voucher.valid_start)} - ${formatDate(voucher.valid_until)} - ${voucher.discount * 100}% off - SỐ LƯỢNG: ${voucher.quantity}`,
    }));
    const [discountInfo, setDiscountInfo] = useState<{ discount: number; id: number | null } | null>(null); // State để lưu thông tin giảm giá từ server
    const [maxDiscountMoneyInfo, setMaxDiscountMoneyInfo] = useState<{
        max_discount_money: number;
        id: number | null;
    } | null>(null); // State để lưu thông tin giá giảm tối đa từ server
    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
    const [couponValue, setCouponValue] = useState("");
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(formattedOptions[0]);

    const [options, setOptions] = useState(formattedOptions);

    const carts = useAppSelector((state) => state.cartSlice.userCart);
    const subTotal = useAppSelector((state) => state.cartSlice.subTotal);
    const subTotalRetail = useAppSelector((state) => state.cartSlice.subTotalRetail);
    const isGetLoading = useAppSelector((state) => state.cartSlice.isGetLoading);

    // const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    // const discount = useAppSelector((state) => state.cartSlice.discount) || 0;

    const handleCheckout = () => {
        const totalWithCoupon = calculateTotal();
        const discount = discountInfo?.discount || 0; // Giảm giá có thể không tồn tại, nên cần xác định giá trị mặc định là 0
        const max_discount_money = maxDiscountMoneyInfo?.max_discount_money || 0; // Giảm giá có thể không tồn tại, nên cần xác định giá trị mặc định là 0
        const coupon_id: number | null = discountInfo?.id || maxDiscountMoneyInfo?.id || null;
        dispatch(invoiceActions.createInvoice({ totalWithCoupon, discount, coupon_id, max_discount_money })).then(
            (response) => {
                if (response.payload?.status_code === 200) {
                    toast.success(response.payload?.message);
                    navigate("/checkout");
                } else {
                    if (response.payload) toast.error(response.payload?.message);
                }
            },
        );
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
    const handleCheckCoupon = () => {
        // Check if couponValue is empty
        if (!selectedVoucher || !selectedVoucher.value.trim()) {
            // Display error toast message if couponValue is empty
            toast.error("Hãy nhập mã trước khi nhấn nút kiểm tra.");
            return;
        }
        setCouponSuccess(null);
        setCouponError(null);
        // Hiển thị ReCAPTCHA
        setShowRecaptcha(true);
    };
    // const handleVoucherChange = (e: any) => {
    //     // Update selected voucher when dropdown value changes
    //     setSelectedVoucher(e.target.value);
    //     setCouponValue(e.target.value);
    // };
    const handleVoucherChange = (selectedOption: OptionType | null) => {
        if (selectedOption !== null) {
            setSelectedVoucher(selectedOption);
            setCouponValue(selectedOption.value);
            setOptions([...options, selectedOption]);
            console.log("giá trị:", selectedOption.value);
        } else {
            setSelectedVoucher({ value: "", label: "" });
            setCouponValue("");
            setOptions([...options, { value: "", label: "" }]);
        }
    };

    const handleCreateOption = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setSelectedVoucher(newOption);
        setCouponValue(inputValue.toUpperCase());
        setOptions([...options, newOption]);
    };

    const applyCouponCode = (code: string) => {
        // Reset previous error message
        setCouponError("");
        setCouponSuccess("");

        // Xóa timeout trước nếu có
        // if (typingTimeout) {
        //     clearTimeout(typingTimeout);
        // }

        // Gọi hàm dispatch ngay khi người dùng nhấn nút
        dispatch(cartActions.getCouponByCode(code.toUpperCase())).then((response) => {
            if (response.payload?.status_code === 200) {
                if (response.payload.data) {
                    const couponData = response.payload.data;
                    const couponDiscount = couponData.discount || 0;
                    const maxDiscountMoney = couponData.max_discount_money || 0;

                    if (couponDiscount * subTotal < maxDiscountMoney) {
                        setDiscountInfo({
                            discount: couponDiscount,
                            id: couponData.id || null,
                        });
                        setMaxDiscountMoneyInfo({
                            max_discount_money: maxDiscountMoney,
                            id: couponData.id || null,
                        });
                        setCouponSuccess("Mã giảm giá hợp lệ! Bạn được giảm " + couponDiscount * 100 + "%");
                    } else {
                        setMaxDiscountMoneyInfo({
                            max_discount_money: maxDiscountMoney,
                            id: couponData.id || null,
                        });
                        setDiscountInfo(null);
                        setCouponSuccess(
                            "Mã giảm giá hợp lệ! Bạn được giảm " +
                                couponDiscount * 100 +
                                "%, nhưng chỉ được giảm tối đa " +
                                maxDiscountMoney +
                                "đ đối với đơn hàng này",
                        );
                    }
                }
            } else {
                setDiscountInfo(null);
                setMaxDiscountMoneyInfo(null);
                setCouponError("Mã giảm giá không hợp lệ!");
            }
        });
        console.log("ReCAPTCHA verified, applying coupon code:", couponValue);
    };

    // Tính toán tổng tiền mới sau khi áp dụng mã giảm giá
    const calculateTotal = () => {
        if (discountInfo) {
            // Nếu có thông tin giảm giá từ server, tính toán tổng tiền mới
            const discountedTotal = subTotal * (1 - discountInfo.discount);
            return discountedTotal;
        } else if (maxDiscountMoneyInfo) {
            // Nếu có thông tin giảm giá tối đa từ server, tính toán tổng tiền mới
            const discountedTotal = subTotal - maxDiscountMoneyInfo.max_discount_money;
            return discountedTotal;
        } else {
            // Nếu không có thông tin giảm giá, tổng tiền không thay đổi
            return subTotal;
        }
    };

    // const getDiscount = (code: string) => {
    //     setTimeout(() => {
    //         dispatch(cartActions.getDiscount(code));
    //     }, 3000);
    // };

    useEffect(() => {
        dispatch(couponActions.getVoucherBySpin());
        dispatch(cartActions.getAllCart());
        setCouponValue("");
        // setSelectedVoucher({ value: '', label: '' });
        // setOptions([...options, { value: '', label: '' }]);
        // dispatch(cartAction.getAllCoupon());
    }, [dispatch]);
    // const location = useLocation();
    // const fromCheckout = location.state?.fromCheckout || false;
    // useEffect(() => {
    //     setCouponValue("");

    //   },[]);
    let count = 0;
    const formatCreateLabel = (inputValue: any) => `Sử dụng: "${inputValue}"`;
    const [currentInputValue, setCurrentInputValue] = useState("");

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
                                        key={cartItem.cart_detail_id}
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
                                                key={cartItem.cart_detail_id}
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

                <div className="flex flex-col w-full h-fit gap-4 p-4">
                    <p className="text-black font-OpenSans text-2xl">Tổng kết đơn hàng</p>
                    <div className="flex flex-col p-4 gap-4 text-lg font-semibold shadow-md border rounded-sm w-full">
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

                        <div className="flex w-full flex-col tablet:flex-row justify-start items-start tablet:items-center tablet:justify-between">
                            <p className="text-gray-600">Mã giảm giá</p>
                            <div className="w-full flex tablet:flex-row flex-col gap-2 tablet:gap-0">
                                <div className="w-full flex justify-start tablet:justify-center">
                                    <CreatableSelect
                                        isClearable
                                        isSearchable
                                        value={selectedVoucher}
                                        onChange={(selectedVoucher) => handleVoucherChange(selectedVoucher)}
                                        inputValue={currentInputValue} // Truyền giá trị cho ô nhập
                                        onInputChange={(inputValue) => {
                                            const uppercaseInputValue = inputValue.toUpperCase();
                                            setCouponValue(uppercaseInputValue);
                                            setCurrentInputValue(uppercaseInputValue); // Cập nhật giá trị hiện tại của ô input
                                        }}
                                        options={formattedOptions}
                                        onCreateOption={handleCreateOption}
                                        formatCreateLabel={formatCreateLabel}
                                        className="max-w-[250px] tablet:max-w-md"
                                        styles={{
                                            container: (provided) => ({
                                                ...provided,
                                                width: 400, // Chiều rộng cố định cho container
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                width: 400, // Chiều rộng cố định cho input
                                            }),
                                        }}
                                    />
                                </div>
                                <button
                                    className="transition-colors text-center text-xs tablet:text-sm bg-bluelogo hover:bg-background hover:text-bluelogo hover:border-bluelogo hover:border p-2 rounded-sm w-28 tablet:w-40  text-white text-hover shadow-md"
                                    onClick={handleCheckCoupon}
                                >
                                    {/* Thay thế dấu "?" bằng biểu tượng hoặc hình ảnh của nút kiểm tra */}
                                    KIỂM TRA
                                </button>
                            </div>
                        </div>
                        {showRecaptcha && (
                            <ReCAPTCHA
                                sitekey="6Ldix7QpAAAAAISxU5qJ7Jh4wGTNao6CR50YzCP3"
                                onChange={(token) => {
                                    console.log("ReCAPTCHA verified, token:", token);
                                    applyCouponCode(selectedVoucher.value);
                                    setShowRecaptcha(false); // Ẩn ReCAPTCHA sau khi được xác nhận
                                    document.querySelectorAll("iframe[src*=recaptcha]").forEach((a) => a.remove());
                                }}
                            />
                        )}

                        {couponSuccess && ( // Render success message if there's any
                            <p className="text-green-500 text-sm">{couponSuccess}</p>
                        )}
                        {couponError && ( // Render error message if there's any
                            <p className="text-red-500 text-sm">{couponError}</p>
                        )}
                        <div className="flex flex-row justify-between">
                            <p className="text-gray-600 text-3xl font-bold">Tổng cộng</p>
                            <div>
                                <p className="text-end text-lightblue text-3xl font-bold">
                                    {calculateTotal().toLocaleString()}đ
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
