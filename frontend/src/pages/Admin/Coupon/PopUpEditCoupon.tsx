import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { NewCoupon as CreateCouponType } from "../../../types/coupon";
import { couponActions } from "../../../redux/slices";
import { editCouponValidationSchema } from "../../../validations/coupon";

type PopUpEditCouponProps = {
    couponId: number;
    // couponCode: string,
    handleCancelEditCoupon(): void;
};

const PopUpEditCoupon: React.FC<PopUpEditCouponProps> = (props) => {
    const coupon = useAppSelector((state) => state.couponSlice.coupon);
    // const imageRef = useRef<HTMLImageElement>(null);
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.couponSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    // const [image, setImage] = useState<File | null>(null);
    const dispatch = useAppDispatch();
    const initialValues: CreateCouponType = {
        code: coupon.code,
        discount: coupon.discount,
        is_event: coupon.is_event,
        remain_quantity: coupon.remain_quantity,
        valid_start: coupon.valid_start,
        valid_until: coupon.valid_until,
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
        formData.append("is_event", String(values.is_event));

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
    }, [dispatch, props.couponId]);
    const validStart = coupon.valid_start.slice(0, -5);
    const validUntil = coupon.valid_until.slice(0, -5);

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
                                                value={validStart} // Thêm giá trị value tương ứng
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
                                                value={validUntil} // Thêm giá trị value tương ứng
                                                onChange={formik.handleChange} // Xử lý sự kiện thay đổi
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
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="is_event"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Coupon cho sự kiện?
                                            </label>
                                            <div className="flex items-center mt-4">
                                                <Field
                                                    type="checkbox"
                                                    name="is_event"
                                                    id="is_event"
                                                    className="mr-2 transform scale-150"
                                                />
                                                <label htmlFor="is_event" className="text-sm text-sm ml-4">
                                                    Check để chọn
                                                </label>
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
