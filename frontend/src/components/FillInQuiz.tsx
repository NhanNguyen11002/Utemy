import { TestDetail, TestProgressType } from "../types/test";
// import { useState } from "react";

type FizzInQuizProps = {
    testProgress: TestProgressType[];
    quiz: TestDetail;
    className?: string;
    handleFill(quiz_answer_id: number, quiz_answer_string: string, is_correct: boolean): void;
};
const FillInQuiz: React.FC<FizzInQuizProps> = (props) => {
    const string = props.quiz.question;
    const id = `fillin-quiz-${props.quiz.quiz_id || 0}`;
    const progress = getSortedQuizAnswerStrings(props.quiz.quiz_id, props.testProgress) ?? [];
    // const [progress, setProgress] = useState(getSortedQuizAnswerStrings(props.quiz.quiz_id, props.testProgress)) ?? [];

    const handleFillIn = (target: any) => {
        const id = target.id.split("-")[2];
        const quiz_answer_string = target.value;
        const quiz_answer_id = props.quiz.quiz_answer[Number(id)].quiz_answer_id || 0;
        const is_correct = props.quiz.quiz_answer[Number(id)].answer.toLowerCase().includes(target.value.toLowerCase());
        props.handleFill(quiz_answer_id, quiz_answer_string, is_correct);
    };
    // const handleInputChange = (index: number, str: string) => {
    //     const newInputValues = [...progress];
    //     newInputValues[index] = str;
    //     setProgress(newInputValues);
    // };
    const renderString = (string: string) => {
        const parts = string.split("$");
        let blankId = 0;
        const element: JSX.Element[] = [];
        parts.forEach((part: string) => {
            if (part === "[...]") {
                element.push(
                    <span>
                        <input
                            type="text"
                            onBlur={(e: any) => handleFillIn(e.target)}
                            id={`blank-${props.quiz?.quiz_id || 0}-${blankId}`}
                            defaultValue={progress[blankId] || ""}
                            className="py-1 px-3 border rounded-md bg-gray-100 border-gray-400"
                        />
                    </span>,
                );
                blankId++;
            } else {
                element.push(<span>{part}</span>);
            }
        });
        return element;
    };

    return (
        <p id={id} className={props.className}>
            {renderString(string)}
        </p>
    );
};

export default FillInQuiz;

const getSortedQuizAnswerStrings = (quizId: number, testProgress: TestProgressType[]) => {
    if (testProgress.length === 0) return [];
    const filteredData = testProgress.filter((item) => item.quiz_id === quizId);
    if (filteredData.length === 0) return [];
    filteredData.sort((a, b) => a.quiz_answer_id - b.quiz_answer_id);

    let result = [];
    let expectedAnswerId = filteredData[0].quiz_answer_id;
    for (let i = 0; i < filteredData.length; i++) {
        const currentItem = filteredData[i];
        while (currentItem.quiz_answer_id !== expectedAnswerId) {
            result.push("");
            expectedAnswerId++;
        }
        result.push(currentItem.quiz_answer_string);
        expectedAnswerId++;
    }

    return result;
};
