import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Section as SectionType } from "../../types/section";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Lecture } from "../../types/lecture";
import LectureCardForTrial from "../Card/LectureCardForTrial";
import { convertSecondsToTimeString } from "../../utils/helper";
type AccordionSectionForTrialType = {
    section: SectionType;
    isDisplayEdit: boolean;
    isDisplayProgress: boolean;
    lectureId?: number;
    redirectToWatchVideo?: boolean;
    handleDisplayDeleteModal?: (id: number, isDeleteSection: boolean) => void;
    handleDisplayEditModal?: (id: number, title: string) => void;
    handleDisplayAddLectureModal?: (id: number) => void;
    handleDisplayEditLecture?: (lectureId: number, type: string) => void;
    handleChangeLesson?: (lecture: Lecture) => void;
    handleDeleteSection?: (id: number) => void;
    handleShowVideoDialog?: (url_video: string, description: string) => void;
    
};

const AccordionSectionForTrial: React.FC<AccordionSectionForTrialType> = (props) => {
    const text = props.section.lecture
        ? props.section.lecture.length === 0
            ? "Chương học chưa có bài học nào"
            : " Chương học chưa có bài học nào"
        : "";
    const lectureCount = props.section.lecture ? props.section.lecture.length : "0";
    const totalDuration: number =
        (props.section.lecture &&
            props.section.lecture?.reduce((acc: number, curr: any) => {
                return acc + Number(curr.content.duration);
            }, 0)) ||
        0;
    return (
        <>
        {lectureCount !== 0 && (
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="border pr-2 pl-6 flex justify-between">
                        <div className="flex justify-between items-center w-[95%]">
                            <div className="flex flex-col gap-1 text-left">
                                <p className="font-semibold">{props.section.title}</p>
                                    <p className="text-sm font-normal">{lectureCount} bài học|  {convertSecondsToTimeString(totalDuration)} </p>
                            </div>
                            {props.isDisplayEdit && (
                                <div className="flex gap-2">
                                    <div
                                        className="cursor-pointer hover:text-lightblue"
                                        onClick={() => {
                                            if (props.handleDisplayAddLectureModal) {
                                                props.handleDisplayAddLectureModal(props.section.id);
                                            }
                                        }}
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </div>
                                    <div
                                        className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                                        onClick={() => {
                                            if (props.handleDisplayEditModal) {
                                                props.handleDisplayEditModal(props.section.id, props.section.title);
                                            }
                                        }}
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </div>
                                    <div
                                        className="cursor-pointer hover:text-lightblue transtion-all duration-300"
                                        onClick={() => {
                                            if (props.handleDisplayDeleteModal) {
                                                props.handleDisplayDeleteModal(props.section.id, true);
                                            }
                                        }}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                        <div className="border">
                            {props.section.lecture && props.section.lecture?.length > 0 ? (
                                props.section.lecture?.map((lecture, index) => (
                                    <div key={index}>
                                        <LectureCardForTrial
                                            key={lecture.lecture_id * index}
                                            lecture={lecture}
                                            lectureId={props.lectureId}
                                            isDisplayEdit={props.isDisplayEdit}
                                            isDisplayProgress={props.isDisplayProgress}
                                            redirectToWatchVideo={props.redirectToWatchVideo}
                                            handleDisplayDeleteModal={props.handleDisplayDeleteModal}
                                            handleDisplayEditLecture={props.handleDisplayEditLecture}
                                            handleChangeLesson={props.handleChangeLesson}
                                            handleShowVideoDialog={props.handleShowVideoDialog}
                                        />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="text-center py-4 mx-auto">
                                        <p className="">{text}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )}
        </>
    );
};

export default AccordionSectionForTrial;
