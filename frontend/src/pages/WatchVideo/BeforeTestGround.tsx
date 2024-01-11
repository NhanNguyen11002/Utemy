import React from "react";
import { PlayIcon, DocumentCheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { secondsToMinutesAndSeconds } from "../../utils/helper";
import { testActions } from "../../redux/slices";
const BeforeTestGround: React.FC = () => {
    const duration = useAppSelector((state) => state.testSlice.test.duration);
    const is_time_limit = useAppSelector((state) => state.testSlice.test.is_time_limit);
    const passPercent = useAppSelector((state) => state.testSlice.test.pass_percent);
    const testTitle = useAppSelector((state) => state.testSlice.test.title);
    const testId = useAppSelector((state) => state.testSlice.test.test_id);
    const dispatch = useAppDispatch();
    // const handleStartTest = () => {
    //     dispatch(testActions.setStartTest());
    // };
    return (
        <>
            <div className="w-full h-[700px] flex items-center justify-center border-black border-2 ">
                <div className="w-3/4 h-[90%] flex flex-col items-center justify-center bg-white round">
                    <div className="flex  flex-col justify-between justify-items-start w-3/4 my-5 gap-2 border-b border-black ">
                        <div className="flex flex-col gap-2 items-center  rounded-md p-2 ">
                            <QuestionMarkCircleIcon className="w-5 h-5 shrink-0 text-black" />
                            <span className="text-black shrink-0 font-bold text-2xl">{testTitle}</span>
                            <span className="text-black shrink-0  text-xl">
                                Để vượt qua bài kiểm tra này bạn cần đạt số điểm{" "}
                                <span className="font-bold">{passPercent * 100}/100</span>
                            </span>
                            <span className="text-black shrink-0  text-xl">
                                Thời lượng:{" "}
                                <span className="font-bold">{secondsToMinutesAndSeconds(Number(duration))}</span>
                            </span>
                            {!is_time_limit ? (
                                <>
                                    <span className="text-black shrink-0 text-lg italic">
                                        Đây là bài kiểm tra <span className="text-success">không giới hạn</span> thời
                                        gian, phía trên chỉ là thời gian hoàn thành lý tưởng
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-black shrink-0 text-lg italic">
                                        Đây là bài kiểm tra <span className="text-error">giới hạn</span> thời gian
                                    </span>
                                </>
                            )}
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
                            onClick={() => dispatch(testActions.setStartTest())}
                            className="btn btn-outline btn-sm  text-black"
                        >
                            <span className="">Bắt đầu</span>
                            <PlayIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BeforeTestGround;
