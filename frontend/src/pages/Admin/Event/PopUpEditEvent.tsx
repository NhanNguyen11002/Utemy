import { Formik, ErrorMessage, Field } from "formik";
import React, { useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast, { Toaster } from "react-hot-toast";
import { NewEvent as CreateEventType } from "../../../types/event";
import { eventActions } from "../../../redux/slices";
import { editEventValidationSchema } from "../../../validations/event";

type PopUpEditEventProps = {
    eventId: number;
    handleCancelEditEvent(): void;
};

const PopUpEditEvent: React.FC<PopUpEditEventProps> = (props) => {
    const event = useAppSelector((state) => state.eventSlice.event);
    // const imageRef = useRef<HTMLImageElement>(null);
    const formikRef = useRef(null);
    const isLoading = useAppSelector((state) => state.eventSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.eventSlice.isGetLoading);
    const dispatch = useAppDispatch();
    const start_date = new Date(event.start_date);
    const end_date = new Date(event.end_date);

    const formatDateTime = (date: Date): string => {
        const pad = (n: number) => (n < 10 ? "0" + n : n);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const initialValues: CreateEventType = {
        name: event.name,
        description: event.description,
        start_date: formatDateTime(start_date),
        end_date: formatDateTime(end_date),
        is_active: event.is_active,
    };
    const handleOnSubmit = async (values: CreateEventType) => {
        const formData = new FormData();
        formData.append("event_id", props.eventId.toString());
        formData.append("name", values.name);
        formData.append("description", values.description.toString());
        const startDate = new Date(values.start_date).toISOString();
        const endDate = new Date(values.end_date).toISOString();
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
        dispatch(eventActions.updateEvent({ event_id: props.eventId, body: formData })).then((response: any) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(eventActions.getEventsWithPagination({ pageIndex: 1, searchItem: "" }));
                props.handleCancelEditEvent();
            } else {
                toast.error(response.payload?.message as string);
            }
        });
    };
    useEffect(() => {
        dispatch(eventActions.getEventById(props.eventId));
    }, [dispatch, props.eventId]);

    // const endDateValue = event.end_date.slice(0, -7);

    return (
        <>
            <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                <Toaster />
                <div className="  max-w-[360px] tablet:max-w-[600px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                    <div className="w-full p-[12px]">
                        <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                            CHỈNH SỬA SỰ KIỆN
                        </h1>
                        {!isGetLoading && event && (
                            <Formik
                                initialValues={initialValues}
                                enableReinitialize //!@$@$$#^%
                                validationSchema={editEventValidationSchema}
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
                                                    <Field
                                                        type="text"
                                                        name="code"
                                                        id="code"
                                                        placeholder={event.code}
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
                                        </div> */}
                                            <div className="flex-1 flex flex-col w-full">
                                                <label
                                                    htmlFor="name"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Tên sự kiện:
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder={event.name}
                                                    className={`${
                                                        formik.errors.name && formik.touched.name ? "border-error" : ""
                                                    } flex-1 w-full min-h-[50px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
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
                                                    as="textarea"
                                                    name="description"
                                                    id="description"
                                                    placeholder={event.description}
                                                    className={`${
                                                        formik.errors.description && formik.touched.description
                                                            ? "border-error"
                                                            : ""
                                                    } flex-1 w-full min-h-[200px] resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
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
                                                    value={formik.values.start_date} // Thêm giá trị value tương ứng
                                                    onChange={formik.handleChange} // Xử lý sự kiện thay đổi
                                                    onBlur={formik.handleBlur} // Xử lý sự kiện blur
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
                                                    htmlFor="start_date"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Ngày kết thúc sự kiện:
                                                </label>
                                                <Field
                                                    type="datetime-local"
                                                    name="end_date"
                                                    id="end_date"
                                                    value={formik.values.end_date} // Thêm giá trị value tương ứng
                                                    onChange={formik.handleChange} // Xử lý sự kiện thay đổi
                                                    onBlur={formik.handleBlur} // Xử lý sự kiện blur
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
                                                {isLoading || isGetLoading ? "Loading..." : "Lưu"}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn text-lg ml-2"
                                                disabled={isLoading || isGetLoading}
                                                onClick={() => {
                                                    props.handleCancelEditEvent();
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

export default PopUpEditEvent;
