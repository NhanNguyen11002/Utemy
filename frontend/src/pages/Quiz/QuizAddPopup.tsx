import React, { useState, useRef } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import {
    HandThumbUpIcon,
    CheckCircleIcon,
    TrashIcon,
    PlusCircleIcon,
    XCircleIcon,
    HandThumbDownIcon,
} from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { QuizAnswerType, QuizType } from "../../types/quiz";
import { CustomeSelect } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { quizActions } from "../../redux/slices";
import { addQuizValidationSchema } from "../../validations/quiz";
import { checkAnswerArray } from "../../utils/helper";
// trc khi thêm answer mới thì xóa hết anwser cũ
type QuizAddPopupProps = {
    handleCancelAdd(): void;
    groupId: number;
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

const QuizAddPopup: React.FC<QuizAddPopupProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.quizSlice.isLoading);
    const typeOptions = [
        {
            value: 1,
            label: "Trắc nghiệm",
        },
    ];
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRightRef = useRef<HTMLInputElement>(null);
    const [add, setAdd] = useState(false);
    const formikRef = useRef(null);
    const [answer, setAnswer] = useState<QuizAnswerType[]>([]);
    const initialValue = {
        question: "",
        type: null,
    };
    const handleOnSubmit = (values: any) => {
        if (props.groupId === 0) {
            toast.error("Please choose group before add quiz");
            return;
        }
        const data: QuizType = {
            ...values,
            quiz_group_id: props.groupId,
            quiz_answer: answer,
        };
        if (answer.length !== 4) {
            setError("Loại câu hỏi trắc nghiệm yêu cầu 4 câu trả lời");
            return;
        }
        if (!checkAnswerArray(answer)) {
            toast.error("One correct answer required");
            return;
        }
        //dispatch add quiz
        dispatch(quizActions.createQuiz(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(quizActions.getAllQuizByGroupId({ searchItem: "", quiz_group_id: props.groupId }));
                props.handleCancelAdd();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const handleChangeStatus = (event: any, formik: any) => {
        formik.setFieldValue("type", event.value);
    };
    const handleClearAnswer = (index: number) => {
        const copy = [...answer];
        copy.splice(index, 1);
        setAnswer(copy);
        setError("");
    };
    const handleSubmitAnswer = () => {
        if (inputRef.current && inputRightRef.current) {
            if (add && inputRef.current.value === "") {
                setError("Vui lòng hoàn tất thêm câu trả lời");
                return;
            }
            const temp: QuizAnswerType = {
                // quiz_answer_id: 0,
                answer: inputRef.current.value,
                is_correct: inputRightRef.current.checked as any,
            };
            setAnswer([...answer, temp]);
            inputRef.current.value = "";
            toggleAdd();
        }
    };
    const toggleAdd = () => {
        setAdd(!add);
        setError("");
    };
    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[750px] max-h-[700px] overflow-auto  rounded-[12px] bg-background p-3 flex-1">
                <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">Tạo câu hỏi mới</h1>
                <div className="w-full p-[12px]">
                    <Formik
                        validationSchema={addQuizValidationSchema}
                        initialValues={initialValue}
                        onSubmit={handleOnSubmit}
                        innerRef={formikRef}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit} className="text-sm mb-1 tablet:text-xl font-medium">
                                <div className="py-2">
                                    <label htmlFor="question" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Tên câu hỏi
                                    </label>{" "}
                                    <br />
                                    <Field
                                        type="text"
                                        name="question"
                                        placeholder="Tên câu hỏi..."
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.question && formik.touched.question && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="question"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="py-2">
                                    <label htmlFor="type" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Loại câu hỏi
                                    </label>{" "}
                                    <br />
                                    <Field
                                        // className="custom-select"
                                        name="type"
                                        component={CustomeSelect}
                                        handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                        options={typeOptions}
                                        isMulti={false}
                                        placeholder="Chọn loại câu hỏi..."
                                        styles={customStyles}
                                        className={`w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                            formik.errors.type && formik.touched.type && "border-error"
                                        } `}
                                    />
                                    <br />
                                    <ErrorMessage
                                        name="type"
                                        component="span"
                                        className="text-[14px] text-error font-medium"
                                    />
                                </div>
                                <div className="gap-2 flex flex-col">
                                    <label htmlFor="answer" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Câu trả lời
                                    </label>{" "}
                                    {answer.length > 0 &&
                                        answer.map((answer, index) => {
                                            return (
                                                <>
                                                    <div
                                                        key={index}
                                                        className="flex rounded-lg bg-[#D4EEF9] border border-1 justify-between gap-2 items-center p-2"
                                                    >
                                                        <p className=" text-black text-lg truncate">{answer.answer}</p>
                                                        <div className="w-[10%] flex gap-1 items-center justify-end shrink-0">
                                                            {answer.is_correct ? (
                                                                <div className="flex gap-1 items-center">
                                                                    <HandThumbUpIcon
                                                                        fill="#28a745"
                                                                        className=" w-4 h-4"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-1 items-center">
                                                                    <HandThumbDownIcon
                                                                        fill="#FF0000"
                                                                        className=" w-4 h-4"
                                                                    />
                                                                </div>
                                                            )}
                                                            <TrashIcon
                                                                className="w-6 h-6 text-black hover:cursor-pointer shrink-0"
                                                                onClick={() => handleClearAnswer(index)}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    {!add ? (
                                        <>
                                            <div
                                                className="flex rounded-l  justify-start items-center gap-2 p-2 hover:cursor-pointer"
                                                onClick={toggleAdd}
                                            >
                                                <PlusCircleIcon className="w-4 h-4 text-lightblue" />
                                                <p className=" text-lightblue">Thêm câu trả lời</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="Answer"
                                                placeholder="Điền vào câu trả lời"
                                                className="input w-full input-info"
                                                onChange={() => setError("")}
                                            />
                                            <label className="label cursor-pointer gap-1">
                                                <span className="label-text">Đúng</span>
                                                <input
                                                    ref={inputRightRef}
                                                    type="radio"
                                                    name="isCorrect"
                                                    className="radio checked:bg-success "
                                                />
                                            </label>
                                            <div className="gap-1 flex">
                                                <button
                                                    type="button"
                                                    className="hover:cursor-pointer"
                                                    onClick={() => handleSubmitAnswer()}
                                                >
                                                    <CheckCircleIcon className="w-8 h-8 " />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="hover:cursor-pointer"
                                                    onClick={() => {
                                                        if (inputRef.current) {
                                                            inputRef.current.value = "";
                                                            toggleAdd();
                                                        }
                                                    }}
                                                >
                                                    <XCircleIcon className="w-8 h-8 " />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {error && (
                                    <div className="text-center">
                                        <h1 className="text-error">{error}</h1>
                                    </div>
                                )}
                                <div className="flex justify-end mt-3 px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={error !== "" || add || isLoading}
                                    >
                                        {add || error || isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button
                                        onClick={props.handleCancelAdd}
                                        type="button"
                                        className="btn text-lg ml-2"
                                        disabled={add || isLoading}
                                    >
                                        {add || isLoading ? "Loading" : "Hủy"}
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

export default QuizAddPopup;
