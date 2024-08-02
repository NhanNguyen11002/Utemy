import React, { useEffect } from "react";
import { BackspaceIcon, DocumentCheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { testActions } from "../../redux/slices";
import HistoryCard from "./HistoryCard";
const HistoryTest: React.FC = () => {
    const testHistory = useAppSelector((state) => state.testSlice.testHistory);
    const testId = useAppSelector((state) => state.testSlice.test.test_id);
    const testTitle = useAppSelector((state) => state.testSlice.test.title);
    const dispatch = useAppDispatch();
    const handleSetBeforeTest = () => {
        dispatch(testActions.setBeforeTest());
    };
    useEffect(() => {
        dispatch(testActions.getTestHistory(testId));
    }, [dispatch, testId]);
    return (
        <>
            <div className="w-full h-[700px] flex flex-col items-center justify-center bg-white round border-gray-400 border">
                <div className="flex  flex-col justify-between justify-items-start w-3/4 my-5 gap-2 border-b border-black ">
                    <div className="flex flex-col gap-2 items-center  rounded-md p-2 w-full">
                        <DocumentCheckIcon className="w-5 h-5 shrink-0 text-black" />
                        <span className="text-black shrink-0 font-bold text-2xl">{testTitle}</span>
                        <span className="text-black shrink-0 text-xl">Đây là lịch sử làm bài kiểm tra gần đây</span>
                        <div className="flex flex-col gap-2 items-center justify-center w-full">
                            {testHistory.length > 0 ? (
                                testHistory.map((history) => {
                                    return <HistoryCard history={history} key={history.test_history_id} />;
                                })
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <QuestionMarkCircleIcon className="w-8 h-8" />{" "}
                                    <h1>Không có lịch sử kiểm tra gần đây</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-3 w-full px-5 my-3">
                    <button type="button" onClick={handleSetBeforeTest} className="btn btn-outline btn-sm text-black ">
                        <BackspaceIcon className="w-5 h-5 " />
                        <span className="">Quay lại bài kiểm tra</span>
                    </button>{" "}
                </div>
            </div>
        </>
    );
};

export default HistoryTest;
