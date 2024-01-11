import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import AnswerCard from "./AnswerCard";
import TimeCounter from "./TimeCounter";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { testActions } from "../../redux/slices";
import { TestProgressType, TestResultType } from "../../types/test";
import FinishTestPopup from "./FinishTestPopup";
import QuestionCounter from "./QuestionCounter";
const TestGround: React.FC = () => {
    const dispatch = useAppDispatch();
    const [finishPopup, setFinishPopup] = useState(false);
    const nowQuestion = useAppSelector((state) => state.testSlice.nowQuestion);
    const questionCount = useAppSelector((state) => state.testSlice.questionCount);
    const questionIndex = useAppSelector((state) => state.testSlice.questionIndex);
    const testProgress: TestProgressType[] = useAppSelector((state) => state.testSlice.testResult.test_progress) ?? [];
    const testResult: TestResultType = useAppSelector((state) => state.testSlice.testResult) ?? {};
    const handleNextQuestion = () => {
        if (questionIndex < questionCount - 1) dispatch(testActions.setNextQuestion());
        else dispatch(testActions.setStopTest());
    };
    const handlePrevQuestion = () => {
        if (questionIndex > 0) dispatch(testActions.setPrevQuestion());
    };
    const handleCheck = (quiz_answer_id: number, is_correct: boolean) => {
        const checkAnswer: TestProgressType = {
            quiz_id: nowQuestion.quiz_id,
            quiz_answer_id,
            is_correct,
        };
        const copyProgress = [...testProgress];
        const updatedProgress = updateTestProgress(copyProgress, checkAnswer);
        dispatch(testActions.setProgress(updatedProgress));
    };
    const handleFinishTest = () => {
        dispatch(testActions.createTestHistory(testResult));
        dispatch(testActions.setStopTest());
    };

    return (
        <>
            <div className="w-full h-[700px] flex items-center justify-center border-black border-2 ">
                <div className="w-3/4 h-[90%] flex flex-col items-center justify-center bg-white round">
                    {finishPopup && (
                        <FinishTestPopup handleFinish={handleFinishTest} handleCancel={() => setFinishPopup(false)} />
                    )}
                    <div className="flex justify-between w-[90%] my-5">
                        <QuestionCounter questionCount={questionCount} questionIndex={questionIndex} />
                        <TimeCounter
                            handleFinish={handleFinishTest}
                            handleOpenFinishPopup={() => setFinishPopup(true)}
                        />
                    </div>
                    <h1 className="text-black font-bold text-xl mb-5 w-[80%]">{nowQuestion.question}</h1>
                    <div className="flex flex-col gap-2 w-3/4 h-2/3 items-center justify-items-center">
                        {nowQuestion.quiz_answer.map((answer, index) => {
                            return (
                                <AnswerCard
                                    quizId={nowQuestion.quiz_id}
                                    key={answer.quiz_answer_id}
                                    handleCheck={handleCheck}
                                    quizAnswer={answer}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between w-full px-5 my-3">
                        <button
                            type="button"
                            onClick={handlePrevQuestion}
                            className="btn btn-outline btn-sm text-black "
                            disabled={questionIndex === 0}
                        >
                            <ArrowLeftIcon className="w-5 h-5 " />
                            <span className="">Trước</span>
                        </button>{" "}
                        <button
                            type="button"
                            onClick={
                                questionIndex === questionCount - 1 ? () => setFinishPopup(true) : handleNextQuestion
                            }
                            className="btn btn-outline btn-sm text-black"
                        >
                            <span className="">{questionIndex === questionCount - 1 ? "Kết thúc" : "Tiếp"}</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestGround;

const updateTestProgress = (testProgressArray: TestProgressType[], newAnswer: TestProgressType) => {
    if (testProgressArray.length > 0) {
        const existingIndex = testProgressArray.findIndex((item) => item.quiz_id === newAnswer.quiz_id);
        if (existingIndex !== -1) {
            testProgressArray[existingIndex] = newAnswer;
        } else {
            testProgressArray.push(newAnswer);
        }
    } else testProgressArray.push(newAnswer);

    return testProgressArray;
};
