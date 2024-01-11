import React from "react";
import { TotalRating } from "../../components";
import { Rating } from "../../types/rating";
import { images } from "../../assets";
import { convertStringDate } from "../../utils/helper";
import { Link } from "react-router-dom";
type CommentCardProps = {
    rating: Rating;
    userId: number;
};
const dummyContent: Record<number, string> = {
    1: "Very bad course",
    2: "Bad course",
    3: "Not so bad",
    4: "Good course",
    5: "Best course",
};

const CommentCard: React.FC<CommentCardProps> = (props) => {
    const date = convertStringDate(props.rating.created_at);
    const isUserComment = props.userId === props.rating.user_id;
    return (
        <div>
            <div className={` flex items-center justify-between w-full h-full rounded-lg my-0 `}>
                <Link to={isUserComment ? `/my-profile` : `/profile/${props.rating.user_id}`}>
                    <div className="avatar mr-1 hover:cursor-pointer">
                        <div
                            className={` items-center justify-between w-14 border ${
                                isUserComment ? "border-lightblue" : "border-black"
                            } rounded-full`}
                        >
                            <img alt="1" src={(props.rating.url_avatar as string) || images.DefaultAvatar} />
                        </div>
                    </div>
                </Link>

                <div className={`w-full py-2 px-6 h-full  bg-navyhover/30 rounded-lg my-1 `}>
                    <div className="flex justify-between">
                        <Link to={isUserComment ? `/my-profile` : `/profile/${props.rating.user_id}`}>
                            <p
                                className={`comment-author mb-1 ${
                                    isUserComment ? "text-lightblue" : "text-black"
                                } font-bold hover:cursor-pointer hover:underline`}
                            >
                                {props.rating.first_name} {props.rating.last_name}
                            </p>
                        </Link>
                        <p className="comment-date mb-1 text-black italic">{date}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="comment w-full flex text-black flex-wrap line-height:1.5 max-height:1.5 ">
                            {props.rating.content !== ""
                                ? props.rating.content
                                : dummyContent[Number(props.rating.score)]}
                        </p>
                        <TotalRating
                            ratingId={Number(props.rating.id)}
                            totalScore={Number(props.rating.score)}
                            isForCourse={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CommentCard;
