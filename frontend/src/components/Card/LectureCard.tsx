import { PlayIcon, DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Lecture } from "../../types/lecture";
import { secondsToMinutesAndSeconds } from "../../utils/helper";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { lectureActions } from "../../redux/slices";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

type LectureCardType = {
    lecture: Lecture;
    handleChangeLesson?: (lecture: Lecture) => void;
    handleDisplayDeleteModal?: (id: number, isDeleteSection: boolean) => void;
    handleDisplayEditLecture?: (lectureId: number, type: string) => void;
    redirectToWatchVideo?: boolean;
    lectureId?: number;
    isDisplayEdit: boolean;
    isDisplayProgress: boolean;
};

const LectureCard: React.FC<LectureCardType> = (props) => {
    const [checked, setChecked] = useState(true);
    console.log(checked);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const slug: string = useAppSelector((state) => state.courseSlice.courseDetail.slug) ?? {};
    return (
        <div
            className={`flex w-full border-y ${
                props.lecture.lecture_id === props.lectureId ? "bg-footer" : ""
            } ${props.isDisplayEdit ? "" : "hover:cursor-pointer hover:bg-footer"}  `}
            onClick={() => {
                if (props.handleChangeLesson) {
                    props.handleChangeLesson(props.lecture);
                }
                if (props.redirectToWatchVideo) {
                    dispatch(lectureActions.setLecture(props.lecture));
                    navigate(`/course-detail/${slug}/watch`);
                }
            }}
            key={`${props.lecture.lecture_id}`}
        >
            {props.isDisplayProgress && (
                <div className="w-[5%] items-start mt-5 flex mx-3">
                    <Checkbox checked={checked} onCheckedChange={() => setChecked(!checked)} />
                </div>
            )}

            <div className={`w-[95%] py-4  pr-4 flex justify-between ${props.isDisplayProgress ? "" : "ml-8"} `}>
                {" "}
                <div className="flex-col items-center justify-between w-full mr-2">
                    <div className="mb-1">
                        <p className="text-base font-medium">{props.lecture.content.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {props.lecture.type === "Lesson" ? (
                            <>
                                <PlayIcon className="w-3 h-3 shrink-0 " />{" "}
                                <p className="text-sm font-normal">
                                    {secondsToMinutesAndSeconds(Number(props.lecture.content.duration))}
                                </p>
                            </>
                        ) : (
                            <>
                                <DocumentIcon className="w-3 h-3 shrink-0" />{" "}
                                <p className="text-sm font-normal">
                                    {secondsToMinutesAndSeconds(Number(props.lecture.content.duration))}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {props.isDisplayEdit && (
                    <div className="flex gap-2 items-center pr-6">
                        <div
                            className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                            onClick={() => {
                                if (props.handleDisplayEditLecture) {
                                    props.handleDisplayEditLecture(props.lecture.lecture_id, props.lecture.type);
                                }
                            }}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </div>
                        <div
                            className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                            onClick={() => {
                                if (props.handleDisplayDeleteModal) {
                                    props.handleDisplayDeleteModal(props.lecture.lecture_id, false); // props.lecture.id
                                }
                            }}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default LectureCard;
