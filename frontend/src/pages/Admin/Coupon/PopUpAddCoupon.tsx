import { couponActions } from "../../../redux/slices";
import { Formik, ErrorMessage, Field, FormikProps } from "formik";
import React, { useRef } from "react";
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
    const isGetLoading = useAppSelector((state) => state.couponSlice.isGetLoading);
    // const [couponCode, setCouponCode] = useState("");
    const dispatch = useAppDispatch();

    // Hàm sinh mã code ngẫu nhiên
    const generateRandomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
            formData.append("is_event", String(values.is_event));
    
            console.log("Here is form data", formData);
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
    
            const response = await dispatch(couponActions.createCoupon(formData));
    
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
        valid_start:"",
        valid_until:"",
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