import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { NewCoupon as CreateCouponType } from "../../../types/coupon";
import { couponActions, eventActions } from "../../../redux/slices";
import { editCouponValidationSchema } from "../../../validations/coupon";

type PopUpEditCouponProps = {
    couponId: number;
    // couponCode: string,
    eventId: number | null;
    handleCancelEditCoupon(): void;
};

const PopUpEditCoupon: React.FC<PopUpEditCouponProps> = (props) => {
    const coupon = useAppSelector((state) => state.couponSlice.coupon);
    // const imageRef = useRef<HTMLImageElement>(null);
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.couponSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    const events = useAppSelector((state) => state.eventSlice.events);
    // const event = useAppSelector((state) => state.eventSlice.event);
    const [isChecked, setIsChecked] = useState(false); // State để theo dõi trạng thái của checkbox
    const [selectedEventId, setSelectedEventId] = useState(''); // Theo dõi trạng thái của dropdown nếu có giá trị được chọn
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     if (events.length > 0 && selectedEventId === '') {
    //         setSelectedEventId(events[0].event_id.toString()); // Chọn giá trị đầu tiên trong dropdown nếu chưa có giá trị được chọn
    //     }
       
    // }, [events, selectedEventId]);
    
    useEffect(() => {
        // Dispatch action để lấy danh sách sự kiện khi component được mount
        dispatch(eventActions.getAllEvents());
    }, [dispatch]);
    const handleCheckboxChange = (e:any) => {
        if (events.length > 0 && selectedEventId === '') {
            setSelectedEventId(events[0].event_id.toString()); // Chọn giá trị đầu tiên trong dropdown nếu chưa có giá trị được chọn
        }
        setIsChecked(e.target.checked); // Cập nhật trạng thái của checkbox khi thay đổi
        if (!e.target.checked) {
            setSelectedEventId('');
        }
    };
    // const [image, setImage] = useState<File | null>(null);
    const validStart = new Date(coupon.valid_start);
    const validUntil = new Date(coupon.valid_until);

    const formatDateTime = (date: Date): string => {
        const pad = (n: number) => (n < 10 ? '0' + n : n);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const initialValues: CreateCouponType = {
        code: coupon.code,
        discount: coupon.discount,
        is_event: coupon.is_event,
        remain_quantity: coupon.remain_quantity,
        valid_start: formatDateTime(validStart),
        valid_until: formatDateTime(validUntil),
        max_discount_money: coupon.max_discount_money,
        event_id: coupon.event_id
    };
    const handleOnSubmit = async (values: CreateCouponType) => {
        const formData = new FormData();
        formData.append("coupon_id", props.couponId.toString());
        formData.append("code", values.code);
        formData.append("discount", values.discount.toString());
        formData.append("remain_quantity", values.remain_quantity.toString());
        const validStart = new Date(values.valid_start).toISOString();
        const validUntil = new Date(values.valid_until).toISOString();
        formData.append("valid_start", validStart);
        formData.append("valid_until", validUntil);
        const isEventValue = selectedEventId !== '' ? 'true' : 'false';
        // Thêm giá trị của is_event vào FormData
        formData.append("is_event", isEventValue);        formData.append("max_discount_money", values.max_discount_money.toString());
        formData.append("event_id", selectedEventId); // Đây là trường ẩn chứa event_id được chọn từ select
        console.log(formData);
        dispatch(couponActions.updateCoupon({ coupon_id: props.couponId, body: formData })).then((response: any) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(couponActions.getCouponsWithPagination({ pageIndex: 1, searchItem: "" }));
                props.handleCancelEditCoupon();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    useEffect(() => {
        console.log("Coupon ID:");
        dispatch(couponActions.getCouponById(props.couponId));
        if (props.eventId !== null) {
            dispatch(eventActions.getEventById(props.eventId)).then((response: any) => {
                setIsChecked(true);
                setSelectedEventId(response.payload.data.event_id);
            });      
        } else {
            setIsChecked(false);
            setSelectedEventId('');
        }
        }, [dispatch, props.couponId, props.eventId]);
    // useEffect(() => {
    //     if (event.event_id.toString() !== '') {
    //         setSelectedEventId(event.event_id.toString()); // Assume id is the property containing the event id
    //         console.log("eventid: ",event.event_id)
    //         setIsChecked(true);
    //     }
    //     else{
    //         setIsChecked(false);
    //         setSelectedEventId('');
    //     }
    // }, [event]);

    // const validUntil = coupon.valid_until.slice(0, -5);

    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                            CHỈNH SỬA PHIẾU GIẢM GIÁ
                        </h1>
                        {!isGetLoading && coupon && (
                        <Formik
                            initialValues={initialValues}
                            enableReinitialize //!@$@$$#^%
                            validationSchema={editCouponValidationSchema}
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
                                                    <Field
                                                        type="text"
                                                        name="code"
                                                        id="code"
                                                        placeholder={coupon.code}
                                                        className={`${
                                                            formik.errors.code && formik.touched.code
                                                                ? "border-error"
                                                                : ""
                                                        } flex-1 w-full   resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                                    />
                                                    <ErrorMessage
                                                        name="code"
                                                        component="span"
                                                        className="text-[14px] text-error font-medium"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3"></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col w-full">
                                            <label
                                                htmlFor="discount"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Mức giảm giá:
                                            </label>
                                            <Field
                                                type="text"
                                                name="discount"
                                                id="discount"
                                                placeholder={coupon.discount}
                                                className={`${
                                                    formik.errors.discount && formik.touched.discount
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
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
                                                value={formik.values.valid_start} // Thêm giá trị value tương ứng
                                                onBlur={formik.handleBlur} // Xử lý sự kiện blur
                                                onChange={formik.handleChange} // Xử lý sự kiện thay đổi
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
                                                value={formik.values.valid_until} // Thêm giá trị value tương ứng
                                                onChange={(e: { target: { value: any; }; }) => {
                                                    formik.handleChange(e);
                                                    console.log("Datetime value changed:", e.target.value);

                                                } }// Xử lý sự kiện thay đổi
                                                onBlur={formik.handleBlur} // Xử lý sự kiện blur
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
                                                placeholder={coupon.remain_quantity}
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
                                                placeholder={coupon.max_discount_money}
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
                                                    onChange={(e) => setSelectedEventId(e.target.value)}>
                                                {/* Render options from events array */}
                                                {events.map((event) => (
                                                    <option key={event.event_id} value={event.event_id}>
                                                        {event.name}
                                                    </option>
                                                ))}
                                            </select>
                                            )}
                                        </div>
                                    </div>

                                    <div className="py-[12px] flex justify-end">
                                        <button
                                            disabled={isLoading}
                                            type="submit"
                                            className="text-white btn btn-info text-lg"
                                        >
                                            {isLoading ? <span className="loading loading-spinner"></span> : ""}
                                            {isLoading || isGetLoading ? "Loading..." : "Lưu"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            disabled={isLoading || isGetLoading}
                                            onClick={() => {
                                                props.handleCancelEditCoupon();
                                                // formik.resetForm(initialValues);
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopUpEditCoupon;
