import React, { useState } from "react";
import { Section } from "../types/section";
import AddIcon from "../assets/icons/AddIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";
import EditSectionIcon from "../assets/icons/EditSectionIcon";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { PlayIcon, BookOpenIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { secondsToMinutesAndSeconds } from "../utils/helper";
import { Course } from "../types/course";
import { lectureActions } from "../redux/slices";
import { Lecture } from "../types/lecture";
type AccordionType = {
    section: Section;
    handleDisplayAddLectureModal?: (id: number) => void;
    isDisplayBtn: boolean;
    handleDeleteSection?: (id: number) => void;
    handleDisplayDeleteModal?: (id: number, isDeleteSection: boolean) => void;
    handleDisplayEditModal?: (id: number, title: string) => void;
    handleDisplayEditLecture?: (lectureId: number, type: string) => void;
    handleChangeLesson?: (lecture: Lecture) => void;
    redirectToWatchVideo?: boolean;
    lectureId?: number;
    disable: boolean;
    // orderLesson: any;
};

const Accordion: React.FC<AccordionType> = (props) => {
    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};

    return (
        <>
            <div>
                <h2 id="accordion-collapse-heading-1">
                    <div
                        className={`flex items-center justify-between w-full p-4  bg-navy rounded-lg my-1 flex-wrap ${
                            show ? " shadow-xl" : ""
                        }`}
                    >
                        <div className="flex gap-2 items-center cursor-pointer" onClick={() => setShow(!show)}>
                            <svg
                                className={`w-3 h-3 ${show ? "rotate-180" : ""} shrink-0`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                            <span className="max-w-[400px] text-white truncate ... flex items-center gap-2">
                                <BookOpenIcon className="w-4 h-4" />
                                {props.section.title}
                            </span>
                        </div>
                        {props.isDisplayBtn && (
                            <div className="flex gap-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayAddLectureModal) {
                                            props.handleDisplayAddLectureModal(props.section.id);
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayEditModal) {
                                            props.handleDisplayEditModal(props.section.id, props.section.title);
                                        }
                                    }}
                                >
                                    <EditSectionIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayDeleteModal) {
                                            props.handleDisplayDeleteModal(props.section.id, true);
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                        )}
                    </div>
                </h2>
            </div>
            {show &&
                props.section.lecture &&
                props.section.lecture.map((lecture, index) => (
                    <div
                        className={`py-4 pl-8 pr-4 border border-black/25 rounded-lg my-2 hover:cursor-pointer hover:bg-footer flex justify-between  ${
                            lecture.lecture_id === props.lectureId ? "bg-footer" : ""
                        }`}
                        onClick={() => {
                            if (props.handleChangeLesson) {
                                props.handleChangeLesson(lecture);
                            }
                            if (props.redirectToWatchVideo) {
                                dispatch(lectureActions.setLecture(lecture));
                                navigate(`/course-detail/${courseDetail.slug}/watch`);
                            }
                        }}
                        key={`${lecture.lecture_id}`}
                    >
                        {" "}
                        <div className="flex items-center justify-between w-full mr-2">
                            <div className="flex items-center gap-2">
                                {lecture.type === "Lesson" ? (
                                    <>
                                        <PlayIcon className="w-4 h-4 shrink-0" /> <p>{lecture.content.title}</p>
                                    </>
                                ) : (
                                    <>
                                        <DocumentIcon className="w-4 h-4 shrink-0" /> <p>{lecture.content.title}</p>
                                    </>
                                )}
                            </div>
                            <div>
                                <p>{secondsToMinutesAndSeconds(Number(lecture.content.duration))}</p>
                            </div>
                        </div>
                        {props.isDisplayBtn && (
                            <div className="flex gap-2">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayEditLecture) {
                                            props.handleDisplayEditLecture(lecture.lecture_id, lecture.type);
                                        }
                                    }}
                                >
                                    <EditSectionIcon />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (props.handleDisplayDeleteModal) {
                                            props.handleDisplayDeleteModal(lecture.lecture_id, false); // lecture.id
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </>
    );
};

export default Accordion;
