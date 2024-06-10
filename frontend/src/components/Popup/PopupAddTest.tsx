import React, { useEffect, useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addTestValidationSchema } from "../../validations/lesson";
import toast, { Toaster } from "react-hot-toast";

import TextEditor from "../TextEditor";
import CustomeSelect from "../CustomSelect";
import { lectureActions, quizActions } from "../../redux/slices";

type AddTestPopupProps = {
    handleCancel: () => void;
    handleRerender: () => void;
    handleCancelChangeType(): void;
    sectionId: number;
    changeType?: boolean;
};
const customStyles = {
    control: (styles: any) => ({
        ...styles,
        position: "static",
        transform: "none",
        borderRadius: "0.375rem",
        padding: "10px",
        boxShadow: "",
    }),
    option: (styles: any) => ({
        ...styles,
    }),
    menu: (styles: any) => ({
        ...styles,
        borderRadius: "0.375rem",
        boxShadow: "0 1px 2px, 0 2px 4px",
    }),
};
const limitOptions = [
    {
        value: false,
        label: "Không",
    },
    {
        value: true,
        label: "Có",
    },
];

const PopupAddTest: React.FC<AddTestPopupProps> = (props) => {
    const isGetLoading = useAppSelector((state) => state.quizSlice.isGetLoading) ?? false;
    const isLoading = useAppSelector((state) => state.lectureSlice.isLoading) ?? false;
    const quizGroupList = useAppSelector((state) => state.quizSlice.quizGroupList) ?? [];
    const formikRef = useRef(null);
    const initialValue = {
        title: "",
        description: "",
        is_time_limit: null,
        duration: "",
        pass_percent: 50,
        quiz_group_id: null,
    };
    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };
    const handleChangeLimit = (event: any, formik: any) => {
        formik.setFieldValue("is_time_limit", event.value as boolean);
    };
    const handleChangeQuizGroup = (event: any, formik: any) => {
        formik.setFieldValue("quiz_group_id", event.value as number);
    };
    const dispatch = useAppDispatch();
    const handleOnSubmit = (values: any) => {
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append(props.changeType ? "lecture_id" : "section_id", props.sectionId.toString());
        formData.append("duration", values.duration);
        formData.append("description", values.description);
        formData.append("type", "Test");
        formData.append("is_time_limit", values.is_time_limit);
        formData.append("pass_percent", values.pass_percent);
        formData.append("quiz_group_id", values.quiz_group_id);

        dispatch(
            props.changeType ? lectureActions.updateLecture(formData) : lectureActions.createLecture(formData),
        ).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                props.handleRerender();
                props.handleCancelChangeType();
                props.handleCancel();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const quizGroupOptions =
        quizGroupList.length > 0
            ? quizGroupList.map((quizGroup) => {
                  const temp = {
                      value: quizGroup.quiz_group_id,
                      label: quizGroup.title,
                  };
                  return temp;
              })
            : [];
    useEffect(() => {
        dispatch(quizActions.getAllQuizGroupHasQuiz());
    }, [dispatch]);

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[900px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] py-2 bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                        Thêm bài kiểm tra mới
                    </h1>
                    <Formik
                        validationSchema={addTestValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                    >
                        {(formik) => (
                            <form
                                onSubmit={formik.handleSubmit}
                                className="text-sm mb-1 tablet:text-xl font-medium w-full"
                            >
                                <div className="px-5 py-3">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Tên bài kiểm tra
                                    </label>{" "}
                                    <br />
                                    <Field
                                        id="title"
                                        type="text"
                                        placeholder="Tên bài kiểm tra"
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
                                <div className="flex gap-2 w-full">
                                    <div className="px-5 py-3 w-1/2">
                                        <label htmlFor="duration" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Thời lượng (phút)
                                        </label>{" "}
                                        <br />
                                        <Field
                                            type="text"
                                            name="duration"
                                            id="duration"
                                            placeholder="Nhập..."
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
                                    <div className="px-5 py-3 w-1/2">
                                        <label
                                            htmlFor="pass_percent"
                                            className="text-sm mb-1 tablet:text-xl font-medium"
                                        >
                                            Mức phần trăm để đạt (%)
                                        </label>{" "}
                                        <br />
                                        <Field
                                            type="text"
                                            name="pass_percent"
                                            id="pass_percent"
                                            placeholder="Nhập"
                                            className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                                formik.errors.pass_percent &&
                                                formik.touched.pass_percent &&
                                                "border-error"
                                            } `}
                                        />
                                        <br />
                                        <ErrorMessage
                                            name="pass_percent"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="px-5 py-1">
                                    <label htmlFor="is_time_limit" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Giới hạn thời gian ?
                                    </label>{" "}
                                    <br />
                                    <ErrorMessage
                                        name="is_time_limit"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    <br />
                                    <Field
                                        handleOnchange={(e: any) => handleChangeLimit(e, formik)}
                                        component={CustomeSelect}
                                        options={limitOptions}
                                        styles={customStyles}
                                        placeholder={"Chọn..."}
                                        name="is_time_limit"
                                        id="is_time_limit"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.is_time_limit &&
                                            formik.touched.is_time_limit &&
                                            "border-error"
                                        } `}
                                    />
                                </div>
                                <div className="px-5 py-1">
                                    <label htmlFor="quiz_group_id" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Chọn bộ câu hỏi
                                    </label>{" "}
                                    <br />
                                    <ErrorMessage
                                        name="quiz_group_id"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    <br />
                                    <Field
                                        handleOnchange={(e: any) => handleChangeQuizGroup(e, formik)}
                                        component={CustomeSelect}
                                        options={quizGroupOptions}
                                        styles={customStyles}
                                        placeholder={"Chọn bộ câu hỏi"}
                                        name="quiz_group_id"
                                        id="quiz_group_id"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.quiz_group_id &&
                                            formik.touched.quiz_group_id &&
                                            "border-error"
                                        } `}
                                    />
                                </div>
                                <div className="px-5 py-3">
                                    <label htmlFor="description" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Mô tả bài kiểm tra
                                    </label>{" "}
                                    <br />
                                    <ErrorMessage
                                        name="description"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                    <Field
                                        as="textarea"
                                        name="description"
                                        id="description"
                                        component={TextEditor}
                                        handleChangeDescription={(description: string) =>
                                            handleDescriptionChange(description, formik)
                                        }
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.description && formik.touched.description && "border-error"
                                        } `}
                                    />
                                    <br />
                                </div>
                                <div className="flex justify-end mt-3 px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={isLoading || isGetLoading}
                                    >
                                        {isLoading || isGetLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            props.handleCancelChangeType();
                                            props.handleCancel();
                                        }}
                                        type="button"
                                        className="btn text-lg ml-2"
                                        disabled={isGetLoading || isLoading}
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
    );
};

export default PopupAddTest;
