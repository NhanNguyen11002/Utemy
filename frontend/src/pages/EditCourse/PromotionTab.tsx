import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { AddPromotion, Course } from "../../types/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import toast from "react-hot-toast";
import DatePicker from "tailwind-datepicker-react";
import { IOptions } from "tailwind-datepicker-react/types/Options";
import { addPromotionValidationSchema } from "../../validations/course";
type PromotionTabProps = {};

const PromotionTab: React.FC<PromotionTabProps> = () => {
    const [show, setShow] = useState<boolean>(false);
    const handleShow = () => {
        setShow(!show);
    };
    const course: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const course_id = course.course_id;
    let sale_until: Date;
    if (course.sale_until) sale_until = new Date(course.sale_until);
    else sale_until = new Date();
    const formikRef = useRef(null);
    const dispatch = useAppDispatch();
    const initialValue: AddPromotion = {
        sale_price: course.sale_price || 0,
        sale_until: sale_until,
        course_id: course_id,
    };
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const handleChangeDate = (event: any, formik: any) => {
        sale_until = event;
        formik.setFieldValue("sale_until", event as Date);
    };
    const handleOnSubmit = (values: any) => {
        const data: AddPromotion = {
            ...values,
        };
        dispatch(courseActions.addPromotion(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(courseActions.setSalePriceAndDate(data));
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    const handleOnStop = () => {
        dispatch(courseActions.stopPromotion(course_id)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(courseActions.setSalePriceAndDate({ sale_price: course.price, sale_until: new Date() }));
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    const options: IOptions = {
        title: "Sale until date",
        autoHide: true,
        todayBtn: false,
        clearBtn: false,
        clearBtnText: "Clear",
        maxDate: new Date("2030-01-01"),
        minDate: new Date("2020-01-01"),
        datepickerClassNames: "top-12",
        defaultDate: new Date(sale_until),
        language: "en",
        disabledDates: [],
        weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        inputNameProp: "date",
        inputIdProp: "date",
        inputPlaceholderProp: "Select Date",
        inputDateFormatProp: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    };
    return (
        <div className="w-full border min-h-[450px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Khuyến mại</p>
            </div>
            <p className="text-lg px-5 py-3">
                Bạn có thể đưa ra quyết định giảm giá khoá học trong một khoảng thời gian mong muốn ngay tại đây
            </p>
            <p className="text-xl font-normal px-5">Giá gốc: {course.price} (VNĐ)</p>
            <div>
                <Formik
                    validationSchema={addPromotionValidationSchema}
                    initialValues={initialValue}
                    onSubmit={handleOnSubmit}
                    innerRef={formikRef}
                    enableReinitialize={true}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-normal">
                            <div className="px-5 py-3">
                                <label htmlFor="sale_price" className="text-sm mb-1 tablet:text-xl font-normal">
                                    Giá sau giảm (VNĐ):
                                </label>
                                <br />
                                <Field
                                    placeholder="Sale price here..."
                                    type="text"
                                    name="sale_price"
                                    className={` w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                        formik.errors.sale_price && formik.touched.sale_price && "border-error"
                                    } `}
                                />
                                <br />
                                <ErrorMessage
                                    name="sale_price"
                                    component="span"
                                    className="text-[14px] text-error font-normal"
                                />
                            </div>
                            <div className="px-5 py-3">
                                <label htmlFor="sale_until" className="text-sm mb-1 tablet:text-xl font-normal">
                                    Giảm giá đến:
                                </label>
                                <br />
                                <Field
                                    placeholder="Sale price here..."
                                    component={DatePicker}
                                    options={options}
                                    onChange={(e: any) => handleChangeDate(e, formik)}
                                    show={show}
                                    setShow={handleShow}
                                    id="sale_until"
                                    name="sale_until"
                                    className={` w-full px-2 py-2 hover:cursor-pointer rounded-lg border-[1px] outline-none ${
                                        formik.errors.sale_until && formik.touched.sale_until && "border-error"
                                    } `}
                                />
                                <ErrorMessage
                                    name="sale_until"
                                    component="span"
                                    className="text-[14px] text-error font-normal"
                                />
                            </div>
                            <div className="flex justify-end px-4">
                                <button
                                    type="submit"
                                    name="save_button"
                                    className="py-3 px-4 bg-blue-400 hover:bg-blue-500 rounded-sm transition-all duration-300 ml-2 text-white text-lg"
                                >
                                    {isLoading ? "Loading..." : "Lưu"}
                                </button>
                                <button
                                    type="button"
                                    name="stop_button"
                                    className="py-3 px-4 bg-red-400 hover:bg-red-500 rounded-sm transition-all duration-300 ml-2 text-white text-lg"
                                    onClick={handleOnStop}
                                >
                                    {isLoading ? "Loading..." : "Dừng giảm"}
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default PromotionTab;
