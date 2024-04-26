import {
    HandThumbUpIcon,
    TrashIcon,
    HandThumbDownIcon,
    PencilIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { QuizAnswerType } from "../../types/quiz";
type PropsType = {
    type: number;
    answer: QuizAnswerType;
    index: number;
    toggleEdit(bool: boolean): void;
    handleClearAnswer(index: number): void;
    handleEditAnswer(index: number, editAnswer: QuizAnswerType): void;
};
const AnswerCardInPopup: React.FC<PropsType> = (props) => {
    const [edit, setEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputRightRef = useRef<HTMLInputElement>(null);
    const handleDoneEditing = () => {
        const temp = {
            answer: inputRef.current ? inputRef.current.value : props.answer.answer,
            is_correct: inputRightRef.current ? inputRightRef.current.checked : props.answer.is_correct,
            quiz_answer_id: props.answer.quiz_answer_id || 0,
        };
        props.handleEditAnswer(props.index, temp);
        setEdit(false);
        props.toggleEdit(false);
    };
    return (
        <>
            {edit ? (
                <div className="flex justify-between items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        className="border border-gray-300 rounded-sm py-2 px-4 w-full"
                        defaultValue={props.answer.answer}
                    />
                    <label className="label cursor-pointer gap-1">
                        <span className="label-text">Đúng</span>
                        <input
                            ref={inputRightRef}
                            type="checkbox"
                            name="isCorrect"
                            defaultChecked={props.answer.is_correct}
                            disabled={props.type === 3}
                            className="radio checked:bg-success "
                        />
                    </label>
                    <CheckCircleIcon
                        className="w-8 h-8 text-black hover:cursor-pointer shrink-0"
                        onClick={() => handleDoneEditing()}
                    />
                </div>
            ) : (
                <div
                    key={props.index}
                    className="flex rounded-lg bg-[#D4EEF9] border border-1 justify-between gap-2 items-center p-2"
                >
                    <p className=" text-black text-lg truncate">{props.answer.answer}</p>
                    <div className="w-[10%] flex gap-1 items-center justify-end shrink-0">
                        {props.answer.is_correct ? (
                            <div className="flex gap-1 items-center">
                                <HandThumbUpIcon className=" text-[#28a745] w-4 h-4" />
                            </div>
                        ) : (
                            <div className="flex gap-1 items-center">
                                <HandThumbDownIcon className="text-[#FF0000] w-4 h-4" />
                            </div>
                        )}
                        <PencilIcon
                            className="w-6 h-6 text-black hover:cursor-pointer shrink-0"
                            onClick={() => {
                                setEdit(true);
                                props.toggleEdit(true);
                            }}
                        />
                        <TrashIcon
                            className="w-6 h-6 text-black hover:cursor-pointer shrink-0"
                            onClick={() => props.handleClearAnswer(props.index)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
export default AnswerCardInPopup;
