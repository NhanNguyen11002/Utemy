import React from "react";

type RatingInPopupProps = {
    handleCheck: (event: any) => void;
    score: number;
};

const RatingInPopup: React.FC<RatingInPopupProps> = (props) => {
    const score = props.score;
    return (
        <div className="rating mt-[-4px] space-x-1">
            <input
                type="radio"
                name="rating-popup"
                id="1"
                className="mask mask-star-2 bg-yellow-500"
                onChange={props.handleCheck}
                checked={score === 1}
            />
            <input
                type="radio"
                name="rating-popup"
                id="2"
                className="mask mask-star-2 bg-yellow-500"
                onChange={props.handleCheck}
                checked={score === 2}
            />
            <input
                type="radio"
                name="rating-popup"
                id="3"
                className="mask mask-star-2 bg-yellow-500"
                onChange={props.handleCheck}
                checked={score === 3}
            />
            <input
                type="radio"
                name="rating-popup"
                id="4"
                className="mask mask-star-2 bg-yellow-500"
                onChange={props.handleCheck}
                checked={score === 4}
            />
            <input
                type="radio"
                name="rating-popup"
                id="5"
                className="mask mask-star-2 bg-yellow-500"
                onChange={props.handleCheck}
                checked={score === 5}
            />
        </div>
    );
};

export default RatingInPopup;
