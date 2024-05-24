import React, { useEffect } from "react";
import { ArrowPathIcon, DocumentCheckIcon, FaceSmileIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { testActions, courseActions } from "../../redux/slices";
import constants from "../../constants";
const AfterTestGround: React.FC = () => {
    const dispatch = useAppDispatch();
    const afterTest = useAppSelector((state) => state.testSlice.afterTest);
    const passPercent = useAppSelector((state) => state.testSlice.test.pass_percent);
    const questionCount = useAppSelector((state) => state.testSlice.questionCount);
    const testId = useAppSelector((state) => state.testSlice.test.test_id);
    const courseId = useAppSelector((state) => state.courseSlice.courseDetail.course_id);
    const lecture = useAppSelector((state) => state.lectureSlice.lecture);
    const role = useAppSelector((state) => state.courseSlice.role) || "Unerolled";
    useEffect(() => {
        if (
            afterTest.totalPercent >= passPercent &&
            lecture.type === "Final Test" &&
            role === constants.util.ROLE_ENROLLED
        )
            dispatch(courseActions.setPassCourse(courseId));
    }, [dispatch, courseId]);
    return (
        <>
            <div className="w-full h-[700px] flex flex-col items-center justify-center bg-white round border-gray-400 border">
                <div className="flex  flex-col justify-between justify-items-start w-1/3 my-5 gap-2 border-b border-black ">
                    <div className="flex flex-col gap-2 items-center  rounded-md p-2 ">
                        {afterTest.totalPercent >= passPercent ? (
                            <FaceSmileIcon className="w-10 h-10 shrink-0 text-success font-bold" />
                        ) : (
                            <FaceFrownIcon className="w-10 h-10 shrink-0 text-error font-bold" />
                        )}

                        <span className="text-black shrink-0 font-bold text-2xl">
                            Tổng điểm: {afterTest.totalPercent * 100}/100
                        </span>
                        {afterTest.totalPercent >= passPercent ? (
                            <>
                                <span className="text-black shrink-0 text-center text-xl">
                                    Chúc mừng bạn <span className="text-success">đã vượt qua</span> bài kiểm tra này
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-black shrink-0 text-center text-xl">
                                    Có vẻ như bạn <span className="text-error">chưa đạt</span> đủ điểm, cố gắng hơn ở
                                    lần sau nhé
                                </span>
                            </>
                        )}

                        <span className="text-black shrink-0">
                            Bạn trả lời <span className="text-success">đúng</span> {afterTest.totalQuestionRight}/
                            {questionCount} câu
                        </span>
                    </div>
                    <div className="flex gap-2 items-center  rounded-md p-2 hover:cursor-pointer"></div>
                </div>

                <div className="flex justify-center gap-3 w-full px-5 my-3">
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(testActions.setHistoryTest());
                            dispatch(testActions.getTestHistory(testId));
                        }}
                        className="btn btn-outline btn-sm text-black "
                    >
                        <DocumentCheckIcon className="w-5 h-5 " />
                        <span className="">Lịch sử</span>
                    </button>{" "}
                    <button
                        type="button"
                        onClick={() => dispatch(testActions.setBeforeTest())}
                        className="btn btn-outline btn-sm  text-black"
                    >
                        <span className="">Làm lại</span>
                        <ArrowPathIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default AfterTestGround;
