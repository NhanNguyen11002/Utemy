import React, { useEffect, useRef, useMemo } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addTestValidationSchema } from "../../validations/lesson";
import toast, { Toaster } from "react-hot-toast";

import TextEditor from "../TextEditor";
import CustomeSelect from "../CustomSelect";
import { lectureActions, quizActions } from "../../redux/slices";

type UpdateTestPopupProps = {
    handleCancel: () => void;
    handleRerender: () => void;
    handleChangeType: () => void;
    lectureId: number;
    key: number;
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

const PopupUpdateTest: React.FC<UpdateTestPopupProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.quizSlice.isLoading) ?? false;
    const quizGroupList = useAppSelector((state) => state.quizSlice.quizGroupList) ?? [];
    const lecture = useAppSelector((state) => state.lectureSlice.lecture) ?? {};
    const formikRef = useRef(null);

    const handleDescriptionChange = (description: string, formik: any) => {
        formik.setFieldValue("description", description);
    };
    const handleChangeLimit = (event: any, formik: any) => {
        formik.setFieldValue("is_time_limit", event.value as boolean);
    };
    const handleChangeQuizGroup = (event: any, formik: any) => {
        formik.setFieldValue("quiz_group_id", event.value as number);
    };
    const handleOnSubmit = (values: any) => {
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("lecture_id", props.lectureId.toString());
        formData.append("duration", values.duration);
        formData.append("description", values.description);
        formData.append("type", "Test");
        formData.append("is_time_limit", values.is_time_limit);
        formData.append("pass_percent", values.pass_percent);
        formData.append("quiz_group_id", values.quiz_group_id);
        dispatch(lectureActions.updateLecture(formData)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(lectureActions.getLectureById(props.lectureId));
                props.handleRerender();
                props.handleCancel();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const defaultTimeLimit = [
        {
            value: lecture.content.is_time_limit,
            label: lecture.content.is_time_limit ? "Có" : "Không",
        },
    ];
    const defaultGroupOptions: any = [];

    const quizGroupOptions =
        quizGroupList.length > 0
            ? quizGroupList.map((quizGroup) => {
                  const temp = {
                      value: quizGroup.quiz_group_id,
                      label: quizGroup.title,
                  };
                  if (temp.value === lecture.content.quiz_group_id) defaultGroupOptions.push(temp);
                  return temp;
              })
            : [];
    useEffect(() => {
        dispatch(quizActions.getAllQuizGroupHasQuiz());
        dispatch(lectureActions.getLectureById(props.lectureId));
    }, [dispatch, props.lectureId]);
    const initialValue = useMemo(() => {
        return {
            title: lecture.content.title,
            description: lecture.content.description,
            is_time_limit: lecture.content.is_time_limit,
            duration: lecture.content.duration / 60,
            pass_percent: (lecture.content.pass_percent * 100).toFixed(0),
            quiz_group_id: lecture.content.quiz_group_id,
        };
    }, [JSON.stringify(lecture.content)]);

    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[900px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] py-2 bg-background mx-auto tablet:mx-0 flex-1">
                <div className="w-full p-[12px]">
                    <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">Sửa bài kiểm tra</h1>
                    <Formik
                        validationSchema={addTestValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                        enableReinitialize={true}
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
                                        type="text"
                                        placeholder="Tên bài kiểm tra"
                                        name="title"
                                        id="title"
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
                                        key={props.key}
                                        handleOnchange={(e: any) => handleChangeLimit(e, formik)}
                                        component={CustomeSelect}
                                        options={limitOptions}
                                        styles={customStyles}
                                        defautlValues={defaultTimeLimit}
                                        placeholder={defaultTimeLimit ? defaultTimeLimit[0].label : "Chọn..."}
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
                                        key={props.key}
                                        handleOnchange={(e: any) => handleChangeQuizGroup(e, formik)}
                                        component={CustomeSelect}
                                        options={quizGroupOptions}
                                        styles={customStyles}
                                        defautlValues={defaultGroupOptions}
                                        placeholder={
                                            defaultGroupOptions.length > 0 ? defaultGroupOptions[0].label : "Chọn"
                                        }
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
                                        key={props.key}
                                        as="textarea"
                                        name="description"
                                        id="description"
                                        description={lecture.content.description}
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
                                <div className="mt-3 px-4 flex justify-between items-center">
                                    <button
                                        type="button"
                                        name="type_button"
                                        onClick={props.handleChangeType}
                                        className="text-black btn text-lg border-2 border-black"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Chọn dạng bài giảng"}
                                    </button>
                                    <div className="flex justify-end ">
                                        <button
                                            type="submit"
                                            name="save_button"
                                            className="text-white btn btn-info text-lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : "Lưu"}
                                        </button>
                                        <button
                                            onClick={props.handleCancel}
                                            type="button"
                                            className="btn text-lg ml-2 text-black border-2 border-black"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default PopupUpdateTest;
