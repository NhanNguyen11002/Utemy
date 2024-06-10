import { QuizType } from "@/types/quiz";
import { TestDetail } from "@/types/test";
// import { us } from "react";

type FillInNoLogicQuizProps = {
    quiz: QuizType | TestDetail;
    className?: string;
    open?: boolean;
};
const FillInNoLogicQuiz: React.FC<FillInNoLogicQuizProps> = (props) => {
    const string = props.quiz.question;
    const quizId = props.quiz.quiz_id;
    const id = `fillin-quiz-${props.quiz.quiz_id || 0}`;
    const renderString = (quizId: number, string: string) => {
        const parts = string.split("$");
        let blankId = 0;
        const element: JSX.Element[] = [];
        parts.forEach((part: string, index) => {
            if (part === "[...]") {
                element.push(
                    <span>
                        <input
                            key={`blank-${quizId}-${blankId}`}
                            type="text"
                            id={`blank-${quizId}-${blankId}`}
                            disabled={true}
                            className="py-1 px-3 border w-[100px] rounded-md bg-gray-100 border-gray-400"
                        />
                    </span>,
                );
                blankId++;
            } else {
                element.push(
                    <span
                        key={index}
                        className="ql-editor fill-in-quizz"
                        dangerouslySetInnerHTML={{ __html: part }}
                    ></span>,
                );
            }
        });
        return element;
    };
    return (
        <div id={id} className={`my-4 description-course ${props.open ? "text-blue-500" : "text-black"}  ql-snow`}>
            {renderString(quizId, string)}
        </div>
    );
};

export default FillInNoLogicQuiz;
