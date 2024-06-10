import { eventActions } from "../../../redux/slices";
import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { NewEvent as CreateEventType } from "../../../types/event";
import { createEventValidationSchema } from "../../../validations/event";
// import { useFormikContext } from 'formik';

type PopUpAddEventProps = {
    handleCancelAddEvent(): void;
};

const PopUpAddEvent: React.FC<PopUpAddEventProps> = (props) => {
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.eventSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.eventSlice.isGetLoading);
    const dispatch = useAppDispatch();
    // useEffect(() => {
    //     // Dispatch action để lấy danh sách sự kiện khi component được mount
    //     dispatch(eventActions.getAllEvents());
    // }, [dispatch]);
    const handleOnSubmit = async (values: CreateEventType) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description.toString());
            const startDate = new Date(values.start_date).toISOString();
            const endDate = new Date(values.end_date).toISOString();
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);
            console.log("Here is form data", formData);
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const response = await dispatch(eventActions.createEvent(formData));

            if (response.payload && response.payload.status_code === 200) {
                dispatch(eventActions.getEventsWithPagination({ searchItem: "", pageIndex: 1 }));
                toast.success(response.payload.message);
                props.handleCancelAddEvent();
            } else {
                toast.error(response.payload?.message as string);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            // Handle error here
        }
    };
    const initialValues: CreateEventType = {
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_active: 0,
    };
    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center ">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1 ">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">THÊM SỰ KIỆN</h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createEventValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex flex-col items-center">
                                        {/* <div className="flex rounded-lg items-start">
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
                                        </div> */}

                                        <div className="flex-1 flex flex-col w-full ">
                                            <label htmlFor="name" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Tên sự kiện
                                            </label>
                                            <Field
                                                as="input"
                                                name="name"
                                                id="name"
                                                placeholder="Tên sự kiện..."
                                                className={`${
                                                    formik.errors.name && formik.touched.name ? "border-error" : ""
                                                } flex-1 w-full  min-h-[50px]  resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Mô tả cho sự kiện:
                                            </label>
                                            <Field
                                                as="input"
                                                name="description"
                                                id="description"
                                                placeholder="Mô tả cho sự kiện..."
                                                className={`${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="start_date"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Ngày bắt đầu sự kiện:
                                            </label>
                                            <Field
                                                type="datetime-local"
                                                name="start_date"
                                                id="start_date"
                                                className={`${
                                                    formik.errors.start_date && formik.touched.start_date
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="start_date"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor="end_date"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Ngày kết thúc sự kiện:
                                            </label>
                                            <Field
                                                type="datetime-local"
                                                name="end_date"
                                                id="end_date"
                                                className={`${
                                                    formik.errors.end_date && formik.touched.end_date
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="end_date"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
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
                                                props.handleCancelAddEvent();
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

export default PopUpAddEvent;
