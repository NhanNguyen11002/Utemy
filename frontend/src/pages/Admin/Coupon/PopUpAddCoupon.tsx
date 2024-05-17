import { couponActions, eventActions } from "../../../redux/slices";
import { Formik, ErrorMessage, Field, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { NewCoupon as CreateCouponType } from "../../../types/coupon";
import { createCouponValidationSchema } from "../../../validations/coupon";
// import { useFormikContext } from 'formik';

type PopUpAddCouponProps = {
    handleCancelAddCoupon(): void;
};

const PopUpAddCoupon: React.FC<PopUpAddCouponProps> = (props) => {
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.couponSlice.isLoading);
    const events = useAppSelector((state) => state.eventSlice.events);
    const coupons = useAppSelector((state) => state.couponSlice.coupons);

    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    const [isChecked, setIsChecked] = useState(false); // State để theo dõi trạng thái của checkbox
    const [selectedEventId, setSelectedEventId] = useState(events.length > 0 ? events[0].event_id : '');
    const [isEvent, setIsEvent] = useState(false); 

    const dispatch = useAppDispatch();
    useEffect(() => {
        // Dispatch action để lấy danh sách sự kiện khi component được mount
        dispatch(eventActions.getAllEvents());
        setSelectedEventId('');
    }, [dispatch]);
    const handleCheckboxChange = (e:any) => {
        setIsChecked(e.target.checked); // Cập nhật trạng thái của checkbox khi thay đổi
        setIsEvent(true);
        if (!e.target.checked) {
            setSelectedEventId('');
            setIsEvent(false);
        }
    };
    const handleDropdownChange = (value: string) => {
        setSelectedEventId(value);
        console.log("Selected event ID:", value); // In ra giá trị đã chọn từ dropdown
    };
    // const [couponCode, setCouponCode] = useState("");

    // Hàm sinh mã code ngẫu nhiên
    const generateRandomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = Math.floor(Math.random() * 3) + 8; // Tạo độ dài từ 8 đến 10 kí tự
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    // const formik = useFormikContext(); // Sử dụng hook useFormikContext để truy cập vào context của Formik

    // Xử lý sự kiện khi nhấn vào nút sinh mã code ngẫu nhiên
    const handleGenerateRandomCode = (formik: FormikProps<CreateCouponType>) => {
        // const randomCode = generateRandomCode();
        // setCouponCode(randomCode);
        // console.log("random code:", randomCode);
        // console.log("coipon code:", couponCode);
        const randomCode = generateRandomCode();
        formik.setFieldValue('code', randomCode);
    };
    const handleOnSubmit = async (values: CreateCouponType) => {
        try {
            const formData = new FormData();
            formData.append("code", values.code);
            formData.append("discount", values.discount.toString());
            formData.append("remain_quantity", values.remain_quantity.toString());
            const validStart = new Date(values.valid_start).toISOString();
            const validUntil = new Date(values.valid_until).toISOString();
            formData.append("valid_start", validStart);
            formData.append("valid_until", validUntil);
            formData.append("is_event", String(isEvent));
            formData.append("max_discount_money", values.max_discount_money.toString());
            if (selectedEventId !== '') {
                formData.append("event_id", String(selectedEventId));
            }
            console.log("Here is form data", formData);
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
    
            const response = await dispatch(couponActions.createCoupon(formData));
            if (selectedEventId) {
                coupons.forEach(coupon => {
                    if (coupon.event_id === Number(selectedEventId)) {
                        dispatch(couponActions.deleteRatio({ coupon_id: coupon.coupon_id }));
                    }
                });
            }
    
            if (response.payload && response.payload.status_code === 200) {
                dispatch(couponActions.getCouponsWithPagination({ searchItem: "", pageIndex: 1 }));
                toast.success(response.payload.message);
                props.handleCancelAddCoupon();
            } else {
                toast.error(response.payload?.message as string);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            // Handle error here
        }
    };
    const initialValues: CreateCouponType = {
        code: "",
        discount: 0,
        is_event: false,
        remain_quantity: 0,
        valid_start: "",
        valid_until: "",
        max_discount_money: 0,
        event_id: null
    };
    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center ">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1 ">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">THÊM PHIẾU GIẢM GIÁ</h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createCouponValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="flex rounded-lg items-start">
                                            <div className="flex flex-col gap-11 ">
                                                <div className="flex-1 flex flex-col w-full ">
                                                    <label
                                                        htmlFor="code"
                                                        className="text-sm mb-1 font-medium tablet:text-xl"
                                                    >
                                                        Mã giảm giá
                                                    </label>
                                                    <div className="flex">
                                                        <Field
                                                            type="text"
                                                            name="code"
                                                            id="code"
                                                            onChange={formik.handleChange} // Sử dụng handleChange của Formik
                                                            value={formik.values.code} // Sử dụng giá trị từ formik.values.code
                                                            placeholder="Mã giảm giá..."
                                                            className={`${
                                                                formik.errors.code && formik.touched.code
                                                                    ? "border-error"
                                                                    : ""
                                                            } flex-1 w-full   resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-info ml-2"
                                                            onClick={() => handleGenerateRandomCode(formik)}
                                                        >
                                                            Sinh mã
                                                        </button>
                                                    </div>
                                                    <ErrorMessage
                                                        name="code"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col w-full ">
                                            <label
                                                htmlFor="discount"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Mức giảm giá
                                            </label>
                                            <Field
                                                as="input"
                                                name="discount"
                                                placeholder="Phần trăm giảm giá..."
                                                className={`${
                                                    formik.errors.discount && formik.touched.discount
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full  min-h-[50px]  resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="discount"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="valid_start"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Ngày bắt đầu:
                                            </label>
                                            <Field
                                                type="datetime-local"
                                                name="valid_start"
                                                id="valid_start"
                                                className={`${
                                                    formik.errors.valid_start && formik.touched.valid_start
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="valid_start"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="valid_until"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Ngày kết thúc:
                                            </label>
                                            <Field
                                                type="datetime-local"
                                                name="valid_until"
                                                id="valid_until"
                                                className={`${
                                                    formik.errors.valid_until && formik.touched.valid_until
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="valid_until"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="remain_quantity"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Số lượng còn lại:
                                            </label>
                                            <Field
                                                type="text"
                                                name="remain_quantity"
                                                id="remain_quantity"
                                                placeholder="Số lượng voucher còn khả dụng..."
                                                className={`${
                                                    formik.errors.remain_quantity && formik.touched.remain_quantity
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="remain_quantity"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="max_discount_money"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Giá giảm tối đa:
                                            </label>
                                            <Field
                                                type="text"
                                                name="max_discount_money"
                                                id="max_discount_money"
                                                placeholder="Giá giảm tối đa cho loại coupon này..."
                                                className={`${
                                                    formik.errors.max_discount_money && formik.touched.max_discount_money
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="max_discount_money"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="is_event"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Coupon cho sự kiện?
                                            </label>
                                            <div className="flex items-center mt-4">
                                                <input
                                                type="checkbox"
                                                name="is_event"
                                                id="is_event"
                                                className="mr-2 transform scale-150"
                                                checked={isChecked} // Sử dụng state để xác định trạng thái của checkbox
                                                onChange={handleCheckboxChange} // Sự kiện xảy ra khi checkbox thay đổi
                                                />
                                                <label htmlFor="is_event" className="text-sm text-sm ml-4">
                                                Check để chọn
                                                </label>
                                            </div>
                                            {isChecked && ( // Hiển thị dropdown nếu checkbox được chọn
                                                <select style={{ marginTop: '20px', backgroundColor: 'lightgray', color: 'black', border: '1px solid black', height: '30px' }}
                                                    value={selectedEventId}
                                                    onChange={(e) => handleDropdownChange(e.target.value)}>
                                                    <option value="" selected>-- Chọn sự kiện --</option>
                                                {/* Render options from events array */}
                                                {events.map((event) => (
                                                    <option key={event.event_id} value={event.event_id}>
                                                        {event.name}
                                                    </option>
                                                ))}
                                            </select>
                                            )}
                                            <div className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                                                Lưu ý: Khi tick chọn sự kiện cho coupon và thêm thành công, toàn bộ tỉ lệ quay từ
                                                <br />
                                                các coupon khác của sự kiện tương ứng đều sẽ được reset lại
                                                <br />
                                                
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-[12px] flex justify-end">
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="text-white btn btn-info text-lg"
                                        >
                                            {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                            {isLoading || isGetLoading ? "Loading..." : "Tạo"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading || isGetLoading}
                                            onClick={() => {
                                                props.handleCancelAddCoupon();
                                                // formik.resetForm(initialValues);
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopUpAddCoupon;
