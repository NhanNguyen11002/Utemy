import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { ThreedotIcon, EditIcon, DeleteIcon } from "../../assets/icons";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { QuizType } from "../../types/quiz";
import { convertStringDate } from "../../utils/helper";
import FillInNoLogicQuiz from "../../components/FillInNoLogicQuiz";
// import { orderLesson } from "../../types/lesson";
type QuizCardProps = {
    quiz: QuizType;
    handleOpenEdit(quiz: QuizType): void;
    handleOpenDelete(quiz: QuizType): void;
};

const QuizCard: React.FC<QuizCardProps> = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const typeSync = "Trắc nghiệm.True/False.Điền khuyết".split(".");
    return (
        <div className="flex h-fit ">
            <>
                <Accordion
                    type="single"
                    collapsible
                    className="my-2 h-fit rounded-lg bg-lightblue/20 mx-5 px-4 pb-1 w-full"
                >
                    <AccordionItem value={props.quiz.quiz_id.toString()}>
                        <AccordionTrigger
                            onClick={() => handleOpen()}
                            className={` transition-colors ${
                                open ? "text-blue-500 hover:!text-blue-700 border-b border-gray-500 mb-1" : "text-black"
                            }`}
                        >
                            <FillInNoLogicQuiz quiz={props.quiz} />
                        </AccordionTrigger>
                        <AccordionContent className=" flex justify-between items-center text-base font-normal">
                            <h1 className="text-black">Loại câu hỏi: {typeSync[props.quiz.type - 1]}</h1>
                            <h1 className="text-black">
                                Ngày chỉnh sửa gần đây: {convertStringDate(props.quiz.updated_at as string)}
                            </h1>
                        </AccordionContent>

                        <div className="gap-2 items-center ">
                            <AccordionContent className=" flex justify-between items-center text-base font-normal">
                                <h1 className="text-black font-bold ">Câu trả lời</h1>
                            </AccordionContent>

                            {props.quiz.quiz_answer.map((answer) => {
                                return (
                                    <AccordionContent className="text-base font-normal flex justify-between text-black bg-white p-3 rounded-md items-center my-1">
                                        <div className="w-[90%] ">
                                            <h1 className="text-black">{answer.answer}</h1>
                                        </div>
                                        <div className="w-[10%] flex gap-1 items-center justify-end shrink-0">
                                            {answer.is_correct ? (
                                                <div className="flex gap-1 items-center">
                                                    <HandThumbUpIcon fill="#28a745" className=" w-4 h-4" />
                                                    <p className="text-success">Đúng</p>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 items-center">
                                                    <HandThumbDownIcon fill="#FF0000" className=" w-4 h-4" />
                                                    <p className="text-error">Sai</p>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                );
                            })}
                        </div>
                    </AccordionItem>
                </Accordion>
            </>

            <div className={`dropdown dropdown-left ${open ? "visible" : "invisible"}`}>
                <div tabIndex={0} role="button" className="btn btn-xs btn-circle m-1 bg-inherit border-0 ">
                    <ThreedotIcon />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => props.handleOpenEdit(props.quiz)}>
                        <span className="flex text-black text-base items-center gap-2">
                            <EditIcon color="#000000" />

                            <span>Chỉnh sửa</span>
                        </span>
                    </li>
                    <li onClick={() => props.handleOpenDelete(props.quiz)}>
                        <span className="flex text-black text-base items-center gap-2">
                            <DeleteIcon color="#000000" />
                            <span>Xóa</span>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default QuizCard;
