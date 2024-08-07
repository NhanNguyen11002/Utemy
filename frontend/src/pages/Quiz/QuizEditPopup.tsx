import React, { useState, useRef, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { CheckCircleIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { QuizAnswerType, QuizType } from "../../types/quiz";
import { CustomeSelect } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { quizActions } from "../../redux/slices";
import { addQuizValidationSchema } from "../../validations/quiz";
import { checkAnswerArray } from "../../utils/helper";
import AnswerCardInPopup from "./AnswerCardInPopup";
import { TextEditorWithImage } from "../../components";
// import { orderLesson } from "../../types/lesson";
// trc khi thêm answer mới thì xóa hết anwser cũ
type QuizEditPopupProps = {
    quiz: QuizType;
    handleCancelEdit(): void;
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

const QuizEditPopup: React.FC<QuizEditPopupProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.quizSlice.isLoading) ?? false;
    const typeSync = ["Trắc nghiệm", "True/False", "Điền khuyết"];
    const typeOptions = [
        {
            value: 1,
            label: "Trắc nghiệm",
        },
        {
            value: 2,
            label: "True/False",
        },
        {
            value: 3,
            label: "Điền khuyết",
        },
    ];
    const [error, setError] = useState("");
    const quizRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRightRef = useRef<HTMLInputElement>(null);
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const formikRef = useRef(null);
    const [answer, setAnswer] = useState<QuizAnswerType[]>(props.quiz.quiz_answer);
    const [type, setType] = useState(props.quiz.type);
    const [content, setContent] = useState(props.quiz.question);
    const initialValue = {
        question: props.quiz.question,
        type: props.quiz.type,
    };
    const handleContentChange = (content: string, formik: any) => {
        formik.setFieldValue("question", content);
        setContent(content);
    };
    const handleOnSubmit = (values: any) => {
        const str = values.question.replaceAll("p>", "span>").replaceAll("<span><br></span>", "<p><br></p");
        const data: QuizType = {
            ...values,
            quiz_group_id: props.quiz.quiz_group_id,
            quiz_answer: answer,
            quiz_id: props.quiz.quiz_id,
            question: str,
        };
        if (type === 0) {
            displayError("Vui lòng chọn loại câu hỏi");
            return;
        }
        if (type === 1) {
            if (answer.length !== 4) {
                displayError("Loại câu hỏi trắc nghiệm yêu cầu 4 câu trả lời");
                return;
            }
            if (checkAnswerArray(answer) !== 1) {
                displayError("Trắc nghiệm chỉ có 1 câu trả lời đúng");
                return;
            }
        } else if (type === 2) {
            if (answer.length !== 2) {
                displayError("Loại câu hỏi true/false yêu cầu 2 câu trả lời");
                return;
            }
            if (checkAnswerArray(answer) !== 1) {
                displayError("True/False chỉ có 1 câu trả lời đúng");
                return;
            }
        } else if (type === 3) {
            if (answer.length < 1) {
                displayError("Loại câu hỏi điền khuyết yêu cầu ít nhất 1 câu trả lời");
                return;
            }
            if (checkAnswerArray(answer) !== checkBlankCount()) {
                displayError("Số lượng câu trả lời đúng phải bằng số lượng khuyết");
                return;
            }
        }
        //dispatch add quiz
        dispatch(quizActions.updateQuiz(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(quizActions.getAllQuizByGroupId({ searchItem: "", quiz_group_id: props.quiz.quiz_group_id }));
                props.handleCancelEdit();
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };
    const handleChangeStatus = (event: any, formik: any) => {
        formik.setFieldValue("type", event.value);
        setType(event.value);
    };
    const handleClearAnswer = (index: number) => {
        const copy = [...answer];
        copy.splice(index, 1);
        setAnswer(copy);
        setError("");
    };
    const handleEditAnswer = (index: number, edited: QuizAnswerType) => {
        const copy = [...answer];
        copy[index] = edited;
        setAnswer(copy);
    };
    const handleSubmitAnswer = () => {
        if (inputRef.current && inputRightRef.current) {
            if (add && inputRef.current.value === "") {
                displayError("Vui lòng hoàn tất thêm câu trả lời");
                return;
            }
            if (edit) {
                displayError("Vui lòng hoàn tất chỉnh sửa câu trả lời");
                return;
            }
            const temp: QuizAnswerType = {
                // quiz_answer_id: 0,
                answer: inputRef.current.value,
                is_correct: type === 3 ? true : inputRightRef.current.checked,
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
    const checkBlankCount = () => {
        if (quizRef.current) {
            const regex = new RegExp("\\$\\[\\.\\.\\.\\]\\$", "g");
            // Sử dụng match() để tìm tất cả các kết quả khớp với biểu thức chính quy
            const matches = quizRef.current.value.match(regex);
            if (matches) {
                const num = matches.length;

                return num;
            } else return 0;
        }
    };
    const onAddBlank = (formik: any) => {
        if (quizRef.current) {
            const position = quizRef.current.selection;
            if (position) {
                quizRef.current.getEditor().insertText(position, "$[...]$");
                const newValue = quizRef.current.value;
                formik.setFieldValue("question", newValue);
            }
        }
        checkBlankCount();
    };
    const displayError = (err: string) => {
        setError(err);
        toast.error(err);
        setTimeout(() => {
            setError("");
        }, 3000);
    };
    useEffect(() => {
        checkBlankCount();
    }, [props.quiz.question]);
    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <Toaster />
            <div className="  max-w-[360px] tablet:max-w-[750px] max-h-[700px] overflow-auto  rounded-[12px] bg-background p-3 flex-1">
                <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">Chỉnh sửa câu hỏi</h1>
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
                                    <label htmlFor="type" className="text-sm mb-1 tablet:text-xl font-medium">
                                        Loại câu hỏi
                                    </label>{" "}
                                    <br />
                                    <Field
                                        name="type"
                                        id="type"
                                        component={CustomeSelect}
                                        handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                        options={typeOptions}
                                        isMulti={false}
                                        placeholder={typeSync[props.quiz.type - 1]}
                                        styles={customStyles}
                                        disabled={add}
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
                                <div className="py-2">
                                    <div className="flex justify-between mb-2">
                                        <label htmlFor="question" className="text-sm mb-1 tablet:text-xl font-medium">
                                            Tên câu hỏi
                                        </label>{" "}
                                        <button
                                            type="button"
                                            onClick={() => onAddBlank(formik)}
                                            className={`text-sm py-1 px-2 rounded-md text-black border-black border hover:cursor-pointer hover:border-gray-400 transition-all ${type === 3 ? "block" : "hidden"}`}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <div className="mb-12">
                                        <Field
                                            component={TextEditorWithImage}
                                            propRef={quizRef}
                                            content={content}
                                            onBlur={checkBlankCount}
                                            handleChangeContent={(content: string) =>
                                                handleContentChange(content, formik)
                                            }
                                            name="question"
                                            id="question"
                                            placeholder="Tên câu hỏi..."
                                            className={`w-full px-2 py-2 rounded-lg border-[1px] text-sm outline-none ${
                                                formik.errors.question && formik.touched.question && "border-error"
                                            } `}
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="question"
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
                                                <AnswerCardInPopup
                                                    key={index}
                                                    toggleEdit={(bool: boolean) => setEdit(bool)}
                                                    type={type}
                                                    answer={answer}
                                                    index={index}
                                                    handleClearAnswer={handleClearAnswer}
                                                    handleEditAnswer={handleEditAnswer}
                                                />
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
                                                id="Answer"
                                                placeholder="Điền vào câu trả lời"
                                                className="input w-full input-info"
                                                onChange={() => setError("")}
                                            />
                                            <label className="label cursor-pointer gap-1">
                                                <span className="label-text">Đúng</span>
                                                <input
                                                    ref={inputRightRef}
                                                    type="checkbox"
                                                    name="isCorrect"
                                                    id="isCorrect"
                                                    defaultChecked={type === 3}
                                                    disabled={type === 3}
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
                                <div className="flex justify-end mt-3 px-4">
                                    <button
                                        type="submit"
                                        name="save_button"
                                        className="text-white btn btn-info text-lg"
                                        disabled={error !== "" || add || edit || isLoading}
                                    >
                                        {add || edit || error || isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button
                                        onClick={props.handleCancelEdit}
                                        type="button"
                                        className="btn text-lg ml-2"
                                        disabled={add || edit || error !== "" || isLoading}
                                    >
                                        {add || edit || error || isLoading ? "Loading" : "Hủy"}
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

export default QuizEditPopup;
