import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { feedbackActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import FeedbackCard from "./FeedbackCard";
import { eveluateList } from "../../../utils/helper";
import useQueryParams from "../../../hooks/useQueryParams";
import { TotalRating } from "../../../components";

export function FeedbackAdmin() {
    const { rating } = useQueryParams();
    const feedbacks = useAppSelector((state) => state.feedbackSlice.feedbacks);
    const totalRecord = useAppSelector((state) => state.feedbackSlice.totalRecord);
    const totalPage = useAppSelector((state) => state.feedbackSlice.totalPage);
    const averageRating = useAppSelector((state) => state.feedbackSlice.averageRating);
    const [pageIndex, setPageIndex] = useState(1);
    const [evaluate, setEvaluate] = useState<number | undefined>(Number(rating));
    const dispatch = useAppDispatch();
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleResetFilter = () => {
        setEvaluate(undefined);
        setPageIndex(1);
    };
    useEffect(() => {
        const data = {
            pageIndex,
            evaluate: Number(evaluate),
        };
        dispatch(feedbackActions.getAllFeedbacks(data));
    }, [dispatch, pageIndex, evaluate]);
    return (
        <>
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2 ">
                <Toaster />
                <div className="flex flex-row w-full items-start justify-center gap-10">
                    <div className="mt-3 flex flex-col justify-center items-center w-1/4">
                        <TotalRating ratingId={Number(5)} totalScore={Number(averageRating)} isForCourse={true} />
                        <p className="mt-4 text-2xl text-center font-bold">Utemy đạt được</p>
                        <div className="hidden tablet:flex divider my-1"></div>
                        <div className="flex justify-between gap-3 w-full">
                            <div className="gap-3">
                                <h2 className="text-2xl font-bold mb-2">Lọc theo điểm số</h2>
                                {eveluateList.map((evaluateItem, index) => {
                                    return (
                                        <label
                                            htmlFor={evaluateItem.title}
                                            className={`flex items-center justify-between mb-1 hover:cursor-pointer ${
                                                evaluate ? (evaluate === 5 - index ? "" : "opacity-30") : ""
                                            } `}
                                            key={index}
                                        >
                                            <div className="flex  gap-2">
                                                <input
                                                    type="radio"
                                                    className="radio radio-info"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setEvaluate(Number(event.target.value));
                                                    }}
                                                    name="evaluate"
                                                    value={evaluateItem.value}
                                                    id={evaluateItem.title}
                                                    checked={evaluate === evaluateItem.value}
                                                />
                                                <span className="text-md laptop:text-xl">{evaluateItem.title}</span>
                                            </div>

                                            <TotalRating
                                                ratingId={`evaluate-${index}`}
                                                totalScore={5 - index}
                                                isForCourse={false}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                            <button className="btn btn-outline text-lg mr-3" onClick={handleResetFilter}>
                                Làm mới
                            </button>
                        </div>
                    </div>
                    <div className="flex my-1  flex-col justify-between w-3/4 px-10 gap border-l-[1px]">
                        {feedbacks.length === 0 ? (
                            <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy phản hồi</p>
                        ) : (
                            <p className="mt-4 text-2xl text-center font-bold">Tìm thấy {totalRecord} phản hồi </p>
                        )}
                        <div>
                            {feedbacks.map((feedback, index) => {
                                return (
                                    <div className="w-full my-1 max-w-xs tablet:max-w-full " key={index}>
                                        <FeedbackCard feedback={feedback} />
                                    </div>
                                );
                            })}
                        </div>
                        {/* absolute bottom-10 right-[200px] */}
                        {totalPage > 1 && (
                            <div className="flex  justify-end my-4 self-end">
                                <Pagination
                                    handleChangePageIndex={handleChangePageIndex}
                                    totalPage={totalPage}
                                    currentPage={pageIndex}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default FeedbackAdmin;
