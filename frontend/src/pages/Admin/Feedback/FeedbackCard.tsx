import React from "react";
import { images } from "../../../assets";
import { Feedback } from "../../../types/feedback";
import { TotalRating } from "../../../components";
type FeedbackCardProps = {
    feedback: Feedback;
};
const FeedbackCard: React.FC<FeedbackCardProps> = (props) => {
    const date = props.feedback.created_at.toString().split(" ");
    return (
        <div>
            <div className={` flex items-center justify-between w-full h-full rounded-lg my-0 `}>
                <div className="avatar mr-1">
                    <div className=" items-center justify-between w-14 border border-black rounded-full">
                        <img alt="1" src={(props.feedback.url_avatar as string) || images.DefaultAvatar} />
                    </div>
                </div>
                <div className={`w-full py-2 px-6 h-full  bg-navyhover/30 rounded-lg my-1 `}>
                    <div className="flex justify-between">
                        <p className="comment-author mb-1 text-black font-bold">
                            {props.feedback.first_name} {props.feedback.last_name}
                        </p>
                        <p className="comment-date mb-1 text-black italic">{date[1] + " " + date[2] + " " + date[3]}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="comment w-full flex text-black flex-wrap line-height:1.5 max-height:1.5 ">
                            {props.feedback.content !== "" && props.feedback.content}
                        </p>
                        <TotalRating
                            ratingId={Number(props.feedback.feedback_id)}
                            totalScore={Number(props.feedback.score)}
                            isForCourse={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FeedbackCard;
