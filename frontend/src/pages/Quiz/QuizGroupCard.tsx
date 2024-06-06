import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

import { ThreedotIcon, EditIcon, DeleteIcon } from "../../assets/icons";
import { QuizGroupType } from "../../types/quiz";

// import { orderLesson } from "../../types/lesson";

type QuizGroupCardProps = {
    handleOpenEdit(group: QuizGroupType): void;
    handleOpenDelete(group: QuizGroupType): void;
    handleOpenGroup(): void;
    group: QuizGroupType;
};
const QuizGroupCard: React.FC<QuizGroupCardProps> = (props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        props.handleOpenGroup();
        setOpen(!open);
    };
    return (
        <>
            <div className="flex gap-2 mx-3">
                <Accordion
                    type="single"
                    collapsible
                    className="my-2 rounded-lg border border-blue-gray-100 px-4 bg-navy/20 w-full"
                >
                    <AccordionItem value={props.group.quiz_group_id.toString()}>
                        <AccordionTrigger
                            onClick={() => handleOpen()}
                            className={`border-b-0 transition-colors ${
                                open ? "text-blue-500 hover:!text-blue-700" : "text-black"
                            }`}
                        >
                            {props.group.title}
                        </AccordionTrigger>
                        <AccordionContent className="p-2 text-base font-normal bg-white rounded-md my-2 text-black">
                            {props.group.description}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className={`dropdown dropdown-left ${open ? "visible" : "invisible"}`}>
                    <div tabIndex={0} role="button" className="btn btn-xs btn-circle m-1 bg-inherit border-0 ">
                        <ThreedotIcon />
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li onClick={() => props.handleOpenEdit(props.group)}>
                            <span className="flex text-black text-base items-center gap-2">
                                <EditIcon color="#000000" />

                                <span>Chỉnh sửa</span>
                            </span>
                        </li>
                        <li onClick={() => props.handleOpenDelete(props.group)}>
                            <span className="flex text-black text-base items-center gap-2">
                                <DeleteIcon color="#000000" />
                                <span>Xóa</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

// const Icon = (props: any) => {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className={`${props.open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
//         >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//         </svg>
//     );
// };

export default QuizGroupCard;
