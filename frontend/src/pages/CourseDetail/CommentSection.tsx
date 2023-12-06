import React, { useState, useEffect } from "react";
import { Rating } from "../../types/rating";
import { RatingPercent } from "../../types/statistic";
import CommentCard from "./CommentCard";
import { TotalRating } from "../../components";
import { RatingIcon } from "../../assets/icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import constants from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices";
type CommentSectionProps = {
    ratingPercent: RatingPercent[];
    averageRating: number;
    ratings: Rating[];
    handleFilterRatings(scoreFilter: number): void;
    handleTogglePopupRating(): void;
    role: string;
    isLogin: boolean;
};
const dummyRatingPercent = [
    { title: 5, percent: 0 },
    { title: 4, percent: 0 },
    { title: 3, percent: 0 },
    { title: 2, percent: 0 },
    { title: 1, percent: 0 },
];
const CommentSection: React.FC<CommentSectionProps> = (props) => {
    const dispatch = useAppDispatch();
    const [scoreFilter, setScoreFilter] = useState(0);
    const user = useAppSelector((state) => state.authSlice.user);
    const handleOnClick = (rate: number) => {
        setScoreFilter(rate);
        props.handleFilterRatings(rate);
    };
    const handleResetFilter = () => {
        setScoreFilter(0);
        props.handleFilterRatings(0);
    };
    useEffect(() => {
        if (props.isLogin && props.role === constants.util.ROLE_ENROLLED) dispatch(authActions.getMe);
    }, [dispatch]);
    return (
        <div>
            <div className="comment my-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl tablet:text-2xl font-bold mb-3">Đánh giá </h2>

                    {props.isLogin && props.role === constants.util.ROLE_ENROLLED && (
                        <button
                            onClick={props.handleTogglePopupRating}
                            className="btn hover:opacity-75 btn-warning text-black btn-sm"
                        >
                            <RatingIcon />
                            <span>Đánh giá khóa học này</span>
                        </button>
                    )}
                </div>

                <div className="flex flex-row gap-2 my-4 items-center">
                    <div className="flex flex-col items-center gap-1 w-1/5">
                        <h1 className="font-bold text-5xl text-[#EAB308]">{props.averageRating}</h1>
                        <TotalRating ratingId={1} totalScore={props.averageRating} isForCourse={true} />
                        <p className="text-[#EAB308]">Đánh giá</p>
                    </div>
                    <div className="flex flex-col gap-5 w-4/5">
                        {props.ratingPercent.length > 0
                            ? props.ratingPercent.map((rating, index) => {
                                  return (
                                      <RatingBar
                                          key={index}
                                          scoreFilter={scoreFilter}
                                          rate={rating.title}
                                          values={rating.percent}
                                          handleOnClick={handleOnClick}
                                          handleResetFilter={handleResetFilter}
                                      />
                                  );
                              })
                            : dummyRatingPercent.map((rating, index) => {
                                  return (
                                      <RatingBar
                                          key={index}
                                          scoreFilter={scoreFilter}
                                          rate={rating.title}
                                          values={rating.percent}
                                          handleOnClick={handleOnClick}
                                          handleResetFilter={handleResetFilter}
                                      />
                                  );
                              })}
                    </div>
                </div>

                {props.ratings.map((rating: Rating, index: number) => {
                    return <CommentCard key={index} userId={user.user_id || 0} rating={rating} />;
                })}
            </div>
        </div>
    );
};

type RatingBarProps = {
    rate: number;
    values: number;
    scoreFilter: number | undefined;
    handleOnClick(rate: number): void;
    handleResetFilter(): void;
};

const RatingBar: React.FC<RatingBarProps> = (props) => {
    return (
        <>
            <div className="flex w-full gap-3">
                <div
                    className={`flex gap-3 w-[95%] shrink-0 items-center hover:cursor-pointer  ${
                        props.scoreFilter ? (props.scoreFilter === props.rate ? "" : "opacity-50") : ""
                    }`}
                    onClick={() => {
                        props.handleOnClick(props.rate);
                    }}
                >
                    <progress className={`progress progress-warning w-[85%]`} value={props.values} max="100"></progress>
                    <DummyRating rate={props.rate} />
                    <h1 className="text-lightblue underline">{props.values}%</h1>
                </div>
                {props.scoreFilter === props.rate && (
                    <XMarkIcon className="w-6 h-6 hover:cursor-pointer" onClick={props.handleResetFilter} />
                )}
            </div>
        </>
    );
};
type DummyRatingProps = {
    rate: number;
};

const DummyRating: React.FC<DummyRatingProps> = ({ rate }) => {
    return (
        <div className="rating rating-sm">
            <input
                type="radio"
                readOnly
                name={`rating-0-${rate}`}
                className="mask mask-star-2 bg-yellow-500"
                checked={rate === 1}
            />
            <input
                type="radio"
                readOnly
                name={`rating-0-${rate}`}
                className="mask mask-star-2 bg-yellow-500"
                checked={rate === 2}
            />
            <input
                type="radio"
                readOnly
                name={`rating-0-${rate}`}
                className="mask mask-star-2 bg-yellow-500"
                checked={rate === 3}
            />
            <input
                type="radio"
                readOnly
                name={`rating-0-${rate}`}
                className="mask mask-star-2 bg-yellow-500"
                checked={rate === 4}
            />
            <input
                type="radio"
                readOnly
                name={`rating-0-${rate}`}
                className="mask mask-star-2 bg-yellow-500"
                checked={rate === 5}
            />
        </div>
    );
};
export default CommentSection;
