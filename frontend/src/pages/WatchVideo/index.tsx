import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions, lectureActions, testActions, progressActions, commentActions } from "../../redux/slices";
import NotFound from "../NotFound";
import { Course } from "../../types/course";
import { VideoPlayer, Spin, WatchVideoHeader, UserToolDropdown } from "../../components";
import AccordionSection from "../../components/Accordion/AccordionSection";
import { Section } from "../../types/section";
import constants from "../../constants";
import { Lecture } from "../../types/lecture";
import TestGround from "./TestGround";
import AfterTestGround from "./AfterTestGround";
import BeforeTestGround from "./BeforeTestGround";
import HistoryTest from "./HistoryTest";
import CommentLectureCard from "./CommentLectureCard";
import PopUpAddComment from "./PopupAddCommentOrReply"; // Import PopUpAddComment component
import "react-quill/dist/quill.snow.css";
const WatchVideo: React.FC = () => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin) ?? false;
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const [getLecture, setGetLecture] = useState(false);
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const testState: number = useAppSelector((state) => state.testSlice.testState);
    const comments = useAppSelector((state) => state.commentSlice.comments);
    const user = useAppSelector((state) => state.authSlice.user);
    const [pageIndex] = useState(1);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false); // State để hiển thị hộp thoại modal thêm bình luận

    const lecture = useAppSelector((state) => state.lectureSlice.lecture) ?? {
        lecture_id: 0,
        content: {
            description: "",
        },
    };
    const [key, setKey] = useState(0);
    console.log(key);

    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const handleChangeLesson = (lecture: Lecture) => {
        setKey((prevKey) => prevKey + 1);
        dispatch(lectureActions.setLecture(lecture));
        dispatch(
            commentActions.getCommentsWithPaginationByLectureId({
                lecture_id: lecture.lecture_id,
                values: {
                    pageIndex: pageIndex,
                },
            }),
        );
    };
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "";

    const dispatch = useAppDispatch();

    const { slug } = useParams();
    useEffect(() => {
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (!response.payload || !response.payload.data || response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                dispatch(courseActions.getRightOfCourse(response.payload?.data.course_id)).then((res) => {
                    if (res.payload && res.payload.data) {
                        if (res.payload.data.role === constants.util.ROLE_ENROLLED) {
                            dispatch(progressActions.getProgressByCourseSlug(slug as string));
                        }
                    }
                });

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
    const [editModes, setEditModes] = useState<{ [key: number]: boolean }>({}); // Định nghĩa kiểu dữ liệu cho editModes

    const handleCommentSave = (commentId: number) => {
        setEditModes((prevModes) => ({ ...prevModes, [commentId]: false }));
    };
    if (role === constants.util.ROLE_USER && !isAdmin) return <NotFound />;
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
                                <VideoPlayer
                                    key={key}
                                    source={lecture.content.url_video ? lecture.content.url_video : ""}
                                    lectureId={lecture.lecture_id}
                                />
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
                                    isDisplayProgress={role === constants.util.ROLE_ENROLLED}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="my-4 ml-10 w-1/2 description-course ">
                    <div className="flex gap-2">
                        <h2 className=" tablet:text-2xl font-bold mb-3">Mô tả bài học</h2>
                        {!isAdmin && role !== constants.util.ROLE_AUTHOR && (
                            <UserToolDropdown courseDetail={courseDetail} isLecture={true} lecture={lecture} />
                        )}
                    </div>
                    {getLecture && lecture.content.description && (
                        <div className="ql-snow">
                            <div
                                className="ql-editor"
                                dangerouslySetInnerHTML={{
                                    __html: lecture.lecture_id !== 0 ? lecture.content.description : "",
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Nút "Bình luận" */}
                <div className="button-container flex items-center justify-center">
                    <button
                        type="submit"
                        className="text-white btn btn-info text-lg mr-2"
                        onClick={() => setShowAddCommentModal(true)}
                    >
                        + Thêm bình luận
                    </button>
                </div>

                {/* Hiển thị hộp thoại modal thêm bình luận */}
                {showAddCommentModal && (
                    <PopUpAddComment
                        onSave={(commentContent: any) => {
                            // Dispatch action để lưu bình luận
                            dispatch(
                                commentActions.createComment({
                                    content: commentContent,
                                    lecture_id: lecture.lecture_id,
                                }),
                            ).then((response) => {
                                if (response.payload && response.payload.status_code === 200) {
                                    // Phản hồi thành công từ createComment, dispatch action mới ở đây
                                    dispatch(
                                        commentActions.getCommentsWithPaginationByLectureId({
                                            lecture_id: lecture.lecture_id,
                                            values: {
                                                pageIndex: 1,
                                            },
                                        }),
                                    );
                                }
                            });
                        }}
                        onCancel={() => setShowAddCommentModal(false)}
                    />
                )}

                {/* Hiển thị danh sách bình luận */}
                <div className="mt-6  ml-16 mr-8">
                    <h2 className="tablet:text-2xl font-bold mb-3">Bình luận</h2>
                    {comments.map((comment, index) => (
                        <CommentLectureCard
                            key={index}
                            comment={comment}
                            userId={user.user_id || undefined}
                            editmode={editModes[comment.comment_id] || false}
                            onCommentSave={() => handleCommentSave(comment.comment_id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default WatchVideo;
