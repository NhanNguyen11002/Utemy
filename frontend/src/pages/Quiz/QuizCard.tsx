import React, { useState } from "react";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { ThreedotIcon, EditIcon, DeleteIcon } from "../../assets/icons";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { QuizType } from "../../types/quiz";
import { convertStringDate } from "../../utils/helper";
// import { orderLesson } from "../../types/lesson";
type QuizCardProps = {
    quiz: QuizType;
    handleOpenEdit(quiz: QuizType): void;
    handleOpenDelete(quiz: QuizType): void;
};

const QuizCard: React.FC<QuizCardProps> = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <div className="flex h-fit ">
            <>
                <Accordion open={open} className="my-2 w-[90%] h-fit rounded-lg bg-lightblue/20 mx-5 px-4 pb-1">
                    <AccordionHeader
                        onClick={() => handleOpen()}
                        className={`  transition-colors ${
                            open ? "text-blue-500 hover:!text-blue-700 border-b border-gray-500" : "text-black"
                        }`}
                    >
                        <h1 className="">{props.quiz.question}</h1>
                    </AccordionHeader>
                    <AccordionBody className=" flex justify-between items-center text-base font-normal">
                        <h1 className="text-black">Loại câu hỏi: {props.quiz.type === 1 && "Trắc nghiệm"}</h1>
                        <h1 className="text-black">
                            Ngày chỉnh sửa gần đây: {convertStringDate(props.quiz.updated_at as string)}
                        </h1>
                    </AccordionBody>

                    <div className="gap-2 items-center ">
                        <AccordionBody className=" flex justify-between items-center text-base font-normal">
                            <h1 className="text-black font-bold ">Câu trả lời</h1>
                        </AccordionBody>

                        {props.quiz.quiz_answer.map((answer) => {
                            return (
                                <AccordionBody className="text-base font-normal flex justify-between text-black bg-white p-3 rounded-md items-center my-1">
                                    <div className="w-[90%] ">
                                        <h1 className="text-black">{answer.answer}</h1>
                                    </div>
                                    <div className="w-[10%] flex gap-1 items-center justify-end shrink-0">
                                        {answer.is_correct ? (
                                            <div className="flex gap-1 items-center">
                                                <HandThumbUpIcon className="text-success w-4 h-4" />
                                                <p className="text-success">Đúng</p>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1 items-center">
                                                <HandThumbDownIcon className="text-error w-4 h-4" />
                                                <p className="text-error">Sai</p>
                                            </div>
                                        )}
                                    </div>
                                </AccordionBody>
                            );
                        })}
                    </div>
                </Accordion>
            </>

            <div className="dropdown dropdown-left ">
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
