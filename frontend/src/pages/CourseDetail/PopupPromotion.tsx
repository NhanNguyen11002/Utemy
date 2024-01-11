import React, { useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { AddPromotion, Course } from "../../types/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "tailwind-datepicker-react";
import { IOptions } from "tailwind-datepicker-react/types/Options";
import { addPromotionValidationSchema } from "../../validations/course";
type PromotionProps = {
    handleAfterPromotion: () => void;
    handleCancel: () => void;
    course: Course;
};

const PopupPromotion: React.FC<PromotionProps> = (props) => {
    const [show, setShow] = useState<boolean>(false);
    const course_id = props.course.course_id;
    let sale_until;
    if (props.course.sale_until) sale_until = props.course.sale_until as Date;
    else sale_until = Date();
    const formikRef = useRef(null);
    const dispatch = useAppDispatch();
    const initialValue: AddPromotion = {
        sale_price: props.course.sale_price || 0,
        sale_until: new Date(sale_until),
        course_id: course_id,
    };
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const handleChangeDate = (event: any, formik: any) => {
        formik.setFieldValue("sale_until", event as Date);
    };
    const handleOnSubmit = (values: any) => {
        const data: AddPromotion = {
            ...values,
        };
        dispatch(courseActions.addPromotion(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                props.handleCancel();
                props.handleAfterPromotion();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    const handleOnStop = () => {
        dispatch(courseActions.stopPromotion(course_id)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                props.handleCancel();
                props.handleAfterPromotion();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    const handleShow = () => {
        setShow(!show);
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
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <Formik
                        validationSchema={addPromotionValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="px-5 py-3">
                                    <label htmlFor="sale_price" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Sale price (VNĐ):
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
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="px-5 py-3">
                                    <label htmlFor="sale_until" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Sale until:
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
                                        className={` w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.sale_until && formik.touched.sale_until && "border-error"
                                        } `}
                                    />
                                    <ErrorMessage
                                        name="sale_until"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="flex justify-end px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="btn btn-info text-white text-lg"
                                    >
                                        {isLoading ? "Loading..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        name="stop_button"
                                        className="btn btn-error ml-2 text-white text-lg"
                                        onClick={handleOnStop}
                                    >
                                        {isLoading ? "Loading..." : "Stop"}
                                    </button>
                                    <button onClick={props.handleCancel} type="button" className="btn text-lg ml-2">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default PopupPromotion;
