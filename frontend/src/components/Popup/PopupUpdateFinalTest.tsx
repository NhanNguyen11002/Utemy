import React, { useEffect, useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addTestValidationSchema } from "../../validations/lesson";
import toast, { Toaster } from "react-hot-toast";

import TextEditor from "../TextEditor";
import CustomeSelect from "../CustomSelect";
import { courseActions, quizActions } from "../../redux/slices";

type UpdateFinalTestPopupProps = {
    handleToggle: (display: boolean) => void;
    handleRerender: () => void;
    finalTest: any;
    courseId: number;
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

const PopupUpdateFinalTest: React.FC<UpdateFinalTestPopupProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.quizSlice.isLoading) ?? false;
    const quizGroupList = useAppSelector((state) => state.quizSlice.quizGroupList) ?? [];
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
        const data = { ...values, course_id: props.courseId };
        dispatch(courseActions.updateFinalTest(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                props.handleRerender();
                props.handleToggle(false);
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const defaultTimeLimit = [
        {
            value: props.finalTest.is_time_limit,
            label: props.finalTest.is_time_limit ? "Có" : "Không",
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
                  if (temp.value === props.finalTest.quiz_group_id) defaultGroupOptions.push(temp);
                  return temp;
              })
            : [];
    useEffect(() => {
        dispatch(quizActions.getAllQuizGroupHasQuiz());
    }, [dispatch, props.courseId]);
    const initialValue = {
        title: props.finalTest.title,
        description: props.finalTest.description,
        is_time_limit: props.finalTest.is_time_limit,
        duration: props.finalTest.duration / 60,
        pass_percent: (props.finalTest.pass_percent * 100).toFixed(0),
        quiz_group_id: props.finalTest.quiz_group_id,
    };

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
                                        defautlValues={defaultTimeLimit}
                                        placeholder={"Chọn..."}
                                        name="is_time_limit"
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
                                        defautlValues={defaultGroupOptions}
                                        placeholder={
                                            defaultGroupOptions.length > 0 ? defaultGroupOptions[0].label : "Chọn"
                                        }
                                        name="quiz_group_id"
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
                                        description={props.finalTest.description}
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
                                            onClick={() => props.handleToggle(false)}
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

export default PopupUpdateFinalTest;
