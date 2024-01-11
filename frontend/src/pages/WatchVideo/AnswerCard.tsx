import React from "react";
import { QuizAnswerType } from "../../types/quiz";
import { useAppSelector } from "../../hooks/hooks";
import { TestProgressType } from "../../types/test";

type AnswerCardProps = {
    quizId: number;
    quizAnswer: QuizAnswerType;
    handleCheck(quiz_answer_id: number, is_correct: boolean): void;
};

const AnswerCard: React.FC<AnswerCardProps> = (props) => {
    const quiz_answer_id = props.quizAnswer.quiz_answer_id ? Number(props.quizAnswer.quiz_answer_id) : 0;
    const testProgress = useAppSelector((state) => state.testSlice.testResult.test_progress) ?? [];
    return (
        <>
            <label
                htmlFor={`radio-${props.quizAnswer.quiz_answer_id}`}
                className="bg-white border-black border-2 w-full h-full rounded-md p-2 flex justify-between hover:cursor-pointer gap-2"
            >
                <div className="w-[5%] shrink-0">
                    <input
                        type="radio"
                        name={`radio-${props.quizId}`}
                        id={`radio-${props.quizAnswer.quiz_answer_id}`}
                        value={props.quizAnswer.is_correct.toString()}
                        className="radio border-black border-2"
                        onChange={() => props.handleCheck(quiz_answer_id, props.quizAnswer.is_correct)}
                        defaultChecked={isExistInProgress(testProgress, quiz_answer_id)}
                    />
                </div>
                <h1 className="text-black w-[95%]">{props.quizAnswer.answer}</h1>
            </label>
        </>
    );
};
const isExistInProgress = (testProgressArray: TestProgressType[], quiz_answer_id: number) => {
    for (const progress of testProgressArray) {
        if (progress.quiz_answer_id === quiz_answer_id) return true;
    }
    return false;
};

export default AnswerCard;
