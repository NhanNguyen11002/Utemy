import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions, lectureActions, testActions } from "../../redux/slices";
import NotFound from "../NotFound";
import { Course } from "../../types/course";
import { VideoPlayer, Spin, WatchVideoHeader } from "../../components";
import AccordionSection from "../../components/Accordion/AccordionSection";
import { Section } from "../../types/section";
import constants from "../../constants";
import { Lecture } from "../../types/lecture";
import TestGround from "./TestGround";
import AfterTestGround from "./AfterTestGround";
import BeforeTestGround from "./BeforeTestGround";
import HistoryTest from "./HistoryTest";
const WatchVideo: React.FC = () => {
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const [getLecture, setGetLecture] = useState(false);
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const testState: number = useAppSelector((state) => state.testSlice.testState);
    const lecture = useAppSelector((state) => state.lectureSlice.lecture) ?? {
        lecture_id: 0,
        content: {
            description: "",
        },
    };

    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const handleChangeLesson = (lecture: Lecture) => {
        dispatch(lectureActions.setLecture(lecture));
    };
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "";

    const dispatch = useAppDispatch();

    const { slug } = useParams();
    useEffect(() => {
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (!response.payload || !response.payload.data || response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                dispatch(courseActions.getRightOfCourse(response.payload?.data.course_id));
                if (response.payload.data.sections && response.payload.data.sections.length > 0) {
                    const sections = response.payload.data.sections;
                    for (const section of sections) {
                        if (section.lecture) {
                            if (section.lecture.length > 0) {
                                dispatch(lectureActions.setLecture(section.lecture[0] as Lecture));
                                setGetLecture(true);
                                setIsNotFound(false);
                                break;
                            } else {
                                setIsNotFound(true);
                            }
                        }
                    }
                } else {
                    setIsNotFound(true);
                }
            }
        });
    }, [dispatch, slug]);
    useEffect(() => {
        if (lecture.type === "Test") {
            dispatch(testActions.setBeforeTest());
            dispatch(testActions.getTestByTestId(lecture.content.id));
        } else return;
    }, [dispatch, lecture.lecture_id]);
    if (role === constants.util.ROLE_USER) return <NotFound />;
    if (isNotFound) return <NotFound />;

    return (
        <>
            {isGetLoading && <Spin />}
            <WatchVideoHeader course={courseDetail} role={role} />

            <div className=" w-full  mt-[66px] mb-[100px] justify-center  flex flex-col">
                <div className="flex flex-col laptop:flex-row justify-center w-full">
                    <div className="w-3/4 shrink-0 mt-1 bg-[#2D2F31] ">
                        {lecture.type === "Lesson" ? (
                            <>
                                <VideoPlayer sourse={lecture.content.url_video ? lecture.content.url_video : ""} />
                            </>
                        ) : (
                            <div className="w-full flex-1 shrink-0">
                                {testState === 0 && <BeforeTestGround />}
                                {testState === 1 && <TestGround />}
                                {testState === 2 && <AfterTestGround />}
                                {testState === 3 && <HistoryTest />}
                            </div>
                        )}
                    </div>
                    <div className="flex-2 max-h-[700px]  laptop:overflow-y-auto shrink-0 w-1/4">
                        {courseDetail.sections?.map((section: Section, index) => {
                            return (
                                <AccordionSection
                                    key={index}
                                    lectureId={lecture.lecture_id}
                                    handleChangeLesson={handleChangeLesson}
                                    section={section}
                                    isDisplayEdit={false}
                                    isDisplayProgress={true}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="my-4 ml-10 w-1/2 description-course ">
                    <h2 className=" tablet:text-2xl font-bold mb-3">Mô tả bài học</h2>
                    {getLecture && lecture.content.description && (
                        <div
                            className=""
                            dangerouslySetInnerHTML={{
                                __html: lecture.lecture_id !== 0 ? lecture.content.description : "",
                            }}
                        ></div>
                    )}
                </div>
            </div>
        </>
    );
};

export default WatchVideo;
