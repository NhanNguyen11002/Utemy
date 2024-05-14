import { useState, useEffect } from "react";
import { TestDetail, TestProgressType } from "../types/test";
// import { us } from "react";

type FizzInQuizProps = {
    testProgress: TestProgressType[];
    quiz: TestDetail;
    className?: string;
    handleFill(quiz_answer_id: number, quiz_answer_string: string, is_correct: boolean): void;
};
const FillInQuiz: React.FC<FizzInQuizProps> = (props) => {
    const string = props.quiz.question;
    const quiz = props.quiz;
    const quizId = quiz.quiz_id;
    const id = `fillin-quiz-${props.quiz.quiz_id || 0}`;
    const progress = getSortedQuizAnswerStrings(quiz, props.testProgress);
    const [field, setField] = useState<{ [key: number]: string }>({});
    useEffect(() => {
        setField((prevFields) => {
            return {
                ...prevFields,
                ...progress,
            };
        });
    }, [quizId, JSON.stringify(progress)]);
    const handleFillIn = (target: any) => {
        const id = target.id.split("-")[2];
        const quiz_answer_string = target.value ? target.value : "";
        const quiz_answer_id = props.quiz.quiz_answer[Number(id)].quiz_answer_id || 0;
        const is_correct =
            quiz_answer_string.trim() === ""
                ? false
                : props.quiz.quiz_answer[Number(id)].answer.toLowerCase().includes(target.value.toLowerCase());
        props.handleFill(quiz_answer_id, quiz_answer_string, is_correct);
    };
    const handleChangeInput = (index: number, target: any) => {
        const copy = { ...field };
        copy[index] = target.value;
        setField(copy);
    };

    const renderString = (quizId: number, string: string) => {
        const parts = string.split("$");
        let blankId = 0;
        const element: JSX.Element[] = [];
        parts.forEach((part: string) => {
            if (part === "[...]") {
                const quiz_answer_id = quiz.quiz_answer[blankId].quiz_answer_id as number;
                element.push(
                    <span>
                        <input
                            key={`blank-${quizId}-${blankId}`}
                            type="text"
                            onBlur={(e: any) => handleFillIn(e.target)}
                            id={`blank-${quizId}-${blankId}`}
                            onChange={(e: any) => handleChangeInput(quiz_answer_id, e.target)}
                            value={field[quiz_answer_id] || ""}
                            className="py-1 px-3 border w-[100px] rounded-md bg-gray-100 border-gray-400"
                        />
                    </span>,
                );
                blankId++;
            } else {
                element.push(<span className="ql-editor" dangerouslySetInnerHTML={{ __html: part }}></span>);
            }
        });
        return element;
    };
    return (
        <div id={id} className="my-4 description-course text-black ql-snow">
            {renderString(quizId, string)}
        </div>
    );
};

export default FillInQuiz;

const getSortedQuizAnswerStrings = (quiz: TestDetail, testProgress: TestProgressType[]) => {
    const quizId = quiz.quiz_id;
    let result: any = {};
    if (testProgress.length === 0) return result;
    const filteredData = testProgress.filter((item) => item.quiz_id === quizId);
    if (filteredData.length === 0) return result;
    filteredData.sort((a, b) => a.quiz_answer_id - b.quiz_answer_id);

    // let expectedAnswerId = filteredData[0].quiz_answer_id;
    for (let i = 0; i < filteredData.length; i++) {
        const currentItem = filteredData[i];
        // while (currentItem.quiz_answer_id !== expectedAnswerId) {
        //     result.push("");
        //     expectedAnswerId++;
        // }
        // result.push(currentItem.quiz_answer_string as string);
        // expectedAnswerId++;
        result[currentItem.quiz_answer_id] = currentItem.quiz_answer_string as string;
    }
    console.log("res of quiz id", quizId, result);
    return result;
};
