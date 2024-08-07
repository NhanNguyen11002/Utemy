import React, { useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { QuizGroupType } from "../../types/quiz";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { quizActions } from "../../redux/slices";
import { addQuizGroupValidationSchema } from "../../validations/quiz";
type QuizGroupEditPopupProps = {
    handleCancelEdit(): void;
    group: QuizGroupType;
};

const QuizGroupEditPopup: React.FC<QuizGroupEditPopupProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.quizSlice.isLoading) ?? false;
    const formikRef = useRef(null);
    const initialValue: QuizGroupType = props.group;
    const handleOnSubmit = (values: QuizGroupType) => {
        const data: QuizGroupType = {
            ...values,
        };
        //dispatch edit group
        dispatch(quizActions.updateQuizGroup(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(quizActions.getAllQuizGroup());
                props.handleCancelEdit();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[750px] max-h-[700px] overflow-auto  rounded-[12px] bg-background p-3 flex-1">
                <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">Chỉnh sửa bộ câu hỏi</h1>
                <div className="w-full p-[12px]">
                    <Formik
                        validationSchema={addQuizGroupValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="py-2">
                                    <label htmlFor="title" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Tên bộ câu hỏi
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder="Tên bộ câu hỏi"
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
                                <div className="py-2">
                                    <label htmlFor="description" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Mô tả bộ câu hỏi
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="description"
                                        id="description"
                                        placeholder="Tên bộ câu hỏi"
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.description && formik.touched.description && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="description"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>

                                <div className="flex justify-end mt-3 px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button
                                        onClick={props.handleCancelEdit}
                                        type="button"
                                        className="btn text-lg ml-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Loading" : "Hủy"}
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

export default QuizGroupEditPopup;
