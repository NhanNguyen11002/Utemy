import { PlayIcon, DocumentIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Lecture } from "../../types/lecture";
import { secondsToMinutesAndSeconds } from "../../utils/helper";
import { Checkbox } from "../ui/checkbox";
import { lectureActions } from "../../redux/slices";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import constants from "../../constants";

type LectureCardType = {
    lecture: Lecture;
    commonLectures: any[];
    handleChangeLesson?: (lecture: Lecture) => void;
    handleDisplayDeleteModal?: (id: number, isDeleteSection: boolean) => void;
    handleDisplayEditLecture?: (lectureId: number, type: string) => void;
    redirectToWatchVideo?: boolean;
    // showWatchVideoButton?:boolean;
    lectureId?: number;
    isDisplayEdit: boolean;
    isDisplayProgress: boolean;
    handleShowVideoDialog?: (url_video: string, description: string) => void;

};

const LectureCard: React.FC<LectureCardType> = (props) => {
    const progress = useAppSelector((state) => state.progressSlice.progress) || new Map<number, any>();
    const lectureProgress = progress.get(props.lecture.lecture_id);
    const check = lectureProgress ? lectureProgress.is_pass : false;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const slug: string = useAppSelector((state) => state.courseSlice.courseDetail.slug) ?? {};
    const isCommonLecture = props.commonLectures.some(
        (commonLecture) => commonLecture.lecture_id === props.lecture.lecture_id
    );
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "Unenrolled";

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
                
                if (props.handleShowVideoDialog && props.commonLectures) {
                    props.commonLectures.forEach((lecture: any) => {
                        if (lecture.lecture_id === props.lecture.lecture_id) {
                            if (props.handleShowVideoDialog) {
                                props.handleShowVideoDialog(lecture.content.url_video, lecture.content.description);
                            }
                        }
                    });
                }
                
                
            }}
            key={`${props.lecture.lecture_id}`}
        >
            {props.isDisplayProgress && (
                <div className="w-[5%] items-start mt-5 flex mx-3">
                    <Checkbox checked={check} disabled />
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
                    {isCommonLecture && role !== constants.util.ROLE_ENROLLED && (
                        <p className="text-sm text-blue-500 cursor-pointer">
                            Học thử tại đây
                        </p>
                    )}
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
