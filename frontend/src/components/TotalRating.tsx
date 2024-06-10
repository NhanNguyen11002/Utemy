import React from "react";
type TotalRatingProps = {
    ratingId: number | string;
    totalScore: number;
    isForCourse: boolean;
};
const TotalRating: React.FC<TotalRatingProps> = (props) => {
    const score = props.totalScore;
    const isForCourse = props.isForCourse;
    const ratingName = isForCourse ? `rating-total-${props.ratingId}` : `rating-comment-${props.ratingId}`;
    return (
        <div className={`  rating ${isForCourse ? "rating-m" : "rating-xs"} rating-half hover:cursor-default  `}>
            <input
                id={`0-${ratingName}`}
                readOnly
                disabled
                type="radio"
                name={ratingName}
                className="rating-hidden hover:cursor-default"
                checked={score === 0}
            />
            <input
                id={`1-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-1  hover:cursor-default"
            />
            <input
                id={`2-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-2 hover:cursor-default"
                checked={score === 1}
            />
            <input
                id={`3-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-1 hover:cursor-default"
                checked={score > 1 && score < 2}
            />
            <input
                id={`4-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-2 hover:cursor-default"
                checked={score >= 2}
            />
            <input
                id={`5-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-1 hover:cursor-default"
                checked={score > 2 && score < 3}
            />
            <input
                id={`6-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-2 hover:cursor-default"
                checked={score >= 3}
            />
            <input
                id={`7-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-1 hover:cursor-default"
                checked={score > 3 && score < 4}
            />
            <input
                id={`8-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-2 hover:cursor-default"
                checked={score >= 4}
            />
            <input
                id={`9-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-1 hover:cursor-default"
                checked={score > 4 && score < 5}
            />
            <input
                id={`10-${ratingName}`}
                readOnly
                type="radio"
                name={ratingName}
                disabled
                className="bg-yellow-500 mask-star-2 mask-half-2 hover:cursor-default"
                checked={score >= 5}
            />
        </div>
    );
};
export default TotalRating;
