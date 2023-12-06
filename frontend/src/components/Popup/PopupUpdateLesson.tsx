import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { UpdateLesson as UpdateLessonType } from "../../types/lesson";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { lessonActions } from "../../redux/slices";
import { addLessonValidationSchema } from "../../validations/lesson";
import TextEditor from "../TextEditor";
import toast, { Toaster } from "react-hot-toast";
import constants from "../../constants";

type UpdateLessonModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
    id: number;
    title: string;
    duration: string;
    description: string;
};

const PopupUpdateLesson: React.FC<UpdateLessonModalProps> = (props) => {
    const isLoading = useAppSelector((state) => state.lessonSlice.isLoading) ?? false;
    const [error, setError] = useState("");
    const [video, setVideo] = useState<File | null>(null);

    const dispatch = useAppDispatch();
    const formikRef = useRef(null);

    const initialValue: UpdateLessonType = {
        title: props.title,
        video: null,
        id: props.id,
        duration: props.duration,
        description: props.description,
    };

    const handleChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        const video_file: File = event.currentTarget.files![0];
        if (video_file) {
            if (video_file.size > 1024 * 1024 * 100) {
                setError(constants.error.ERROR_VIDEO_TOO_BIG);
            } else {
                const video_extension = video_file.type;
                if (
                    video_extension === constants.util.VIDEO_MP4 ||
                    video_extension === constants.util.VIDEO_MKV ||
                    video_extension === constants.util.VIDEO_MOV
                ) {
                    setVideo(video_file);
                } else {
                    setError(constants.error.ERROR_VIDEO_NOT_SUPPORTED);
                }
            }
        }
    };

    const handleOnSubmit = (values: UpdateLessonType) => {
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("video", video as File);
        formData.append("lesson_id", values.id.toString());
        formData.append("duration", values.duration);
        formData.append("description", values.description);

        dispatch(lessonActions.updateLesson(formData))
            .then((response) => {
                if (response.payload) {
                    if (response.payload.status_code !== 200) {
                        toast.error(response.payload.message);
                    } else {
                        toast.success(response.payload.message);
                        props.handleCancel();
                    }
                }
            })
            .catch((error: any) => {
                toast.error(error);
            });
    };
    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };
    useEffect(() => {
        dispatch(lessonActions.getLessonById(props.id));
    }, [dispatch]);

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">Sửa bài học</h1>
                    <Formik
                        validationSchema={addLessonValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="px-5 py-3">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Tên bài học
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="title"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.title && formik.touched.title && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="title"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="px-5 py-3 ">
                                    <label htmlFor="video" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Video bài học
                                    </label>{" "}
                                    <br />
                                    <input
                                        id="video"
                                        ref={formikRef}
                                        type="file"
                                        name="video"
                                        className={` file-input file-input-bordered file-input-info w-full ${
                                            error !== "" ? "border-red border-[1px]" : ""
                                        } `}
                                        onChange={handleChangeVideo}
                                    />
                                    {error !== "" && (
                                        <span className=" m-auto text-[15px] text-error font-medium ">{error}</span>
                                    )}
                                </div>
                                <div className="px-5 py-3">
                                    <label htmlFor="duration" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Thời lượng
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="duration"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.duration && formik.touched.duration && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="duration"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="px-5 py-3">
                                    <label htmlFor="description" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Mô tả
                                    </label>{" "}
                                    <br />
                                    <ErrorMessage
                                        name="description"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    <br />
                                    <Field
                                        as="textarea"
                                        name="description"
                                        component={TextEditor}
                                        description={props.description}
                                        handleChangeDescription={(description: string) =>
                                            handleDescriptionChange(description, formik)
                                        }
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.description && formik.touched.description && "border-error"
                                        } `}
                                    />
                                </div>
                                <div className="flex justify-end px-4 mt-11">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={error !== "" || isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button onClick={props.handleCancel} type="button" className="btn text-lg ml-2">
                                        Hủy
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

export default PopupUpdateLesson;
