import React from "react";
import { Link } from "react-router-dom";
import { WatchVideoIcon, RatingIcon } from "../../assets/icons";
import { Course as CourseDetail } from "../../types/course";
type SubscribeUserButtonProps = {
    handleTogglePopupRating(): void;
    handleToggleUnsubscribeCourse(): void;
    courseDetail: CourseDetail;
};

const SubscribeUserButton: React.FC<SubscribeUserButtonProps> = (props) => {
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <button className="text-white btn btn-primary text-lg">
                    <WatchVideoIcon />
                    <Link to={`/course-detail/${props.courseDetail.slug}/watch`}>
                        <span>Learn Now</span>
                    </Link>
                </button>
            )}
            <button
                onClick={props.handleTogglePopupRating}
                className="btn bg-backgroundHover border-backgroundHover hover:bg-backgroundHover hover:border-backgroundHover btn-primary text-black text-lg"
            >
                <RatingIcon />
                <span>Vote</span>
            </button>
            {/* <button onClick={props.handleToggleUnsubscribeCourse} className="btn btn-error text-lg">
                <DeleteIcon color="#000000" />
                <span>Unsubcribe</span>
            </button> */}
        </>
    );
};

export default SubscribeUserButton;
