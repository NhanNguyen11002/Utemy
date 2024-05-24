import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import AnswerCard from "./AnswerCard";
import TimeCounter from "./TimeCounter";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { testActions, progressActions } from "../../redux/slices";
import { TestProgressType, TestResultType } from "../../types/test";
import FinishTestPopup from "./FinishTestPopup";
import QuestionCounter from "./QuestionCounter";
import { FillInQuiz, FillInNoLogicQuiz } from "../../components";
const TestGround: React.FC = () => {
    const dispatch = useAppDispatch();
    const slug = useAppSelector((state) => state.courseSlice.courseDetail.slug);
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
            type: nowQuestion.type,
            quiz_answer_id,
            is_correct,
        };
        const copyProgress = [...testProgress];
        const updatedProgress = updateTestProgress(copyProgress, checkAnswer);
        dispatch(testActions.setProgress(updatedProgress));
    };
    const handleFill = (quiz_answer_id: number, quiz_answer_string: string, is_correct: boolean) => {
        const checkAnswer: TestProgressType = {
            quiz_id: nowQuestion.quiz_id,
            type: nowQuestion.type,
            quiz_answer_id,
            quiz_answer_string,
            is_correct,
        };
        const copyProgress = [...testProgress];
        const updatedProgress = updateTestProgress(copyProgress, checkAnswer);
        dispatch(testActions.setProgress(updatedProgress));
    };
    const handleFinishTest = () => {
        dispatch(testActions.createTestHistory(testResult)).then((res) => {
            if (res.payload?.status_code === 200) {
                dispatch(progressActions.getProgressByCourseSlug(slug));
            }
        });
        dispatch(testActions.setStopTest());
    };

    return (
        <>
            <div className="relative w-full h-[700px] flex flex-col items-center justify-center bg-white border-gray-400 border">
                {finishPopup && (
                    <FinishTestPopup handleFinish={handleFinishTest} handleCancel={() => setFinishPopup(false)} />
                )}
                <div className="flex justify-between w-[90%] my-5">
                    <QuestionCounter questionCount={questionCount} questionIndex={questionIndex} />
                    <TimeCounter handleFinish={handleFinishTest} handleOpenFinishPopup={() => setFinishPopup(true)} />
                </div>
                <div className="w-4/5 h-[70%]">
                    {nowQuestion.type === 3 ? (
                        <FillInQuiz quiz={nowQuestion} handleFill={handleFill} testProgress={testProgress} />
                    ) : (
                        <FillInNoLogicQuiz quiz={nowQuestion} />
                    )}
                    {nowQuestion.type !== 3 && (
                        <div className="grid grid-rows-2 grid-cols-2 gap-2 w-full items-center justify-items-center h-[20%]">
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
                    )}
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
                        onClick={questionIndex === questionCount - 1 ? () => setFinishPopup(true) : handleNextQuestion}
                        className="btn btn-outline btn-sm text-black"
                    >
                        <span className="">{questionIndex === questionCount - 1 ? "Kết thúc" : "Tiếp"}</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default TestGround;

const updateTestProgress = (testProgressArray: TestProgressType[], newAnswer: TestProgressType) => {
    if (testProgressArray.length > 0) {
        const existingIndex =
            newAnswer.type !== 3
                ? testProgressArray.findIndex((item) => item.quiz_id === newAnswer.quiz_id)
                : testProgressArray.findIndex(
                      (item) => item.quiz_id === newAnswer.quiz_id && item.quiz_answer_id === newAnswer.quiz_answer_id,
                  );
        if (existingIndex !== -1) {
            testProgressArray[existingIndex] = newAnswer;
        } else {
            testProgressArray.push(newAnswer);
        }
    } else testProgressArray.push(newAnswer);
    return testProgressArray;
};
