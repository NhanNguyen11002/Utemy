import React from "react";
import { Link } from "react-router-dom";
import { WatchVideoIcon } from "../../assets/icons";
import { Course as CourseDetail } from "../../types/course";
type SubscribeUserButtonProps = {
    courseDetail: CourseDetail;
};

const SubscribeUserButton: React.FC<SubscribeUserButtonProps> = (props) => {
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <button className=" btn btn-sm btn-info ">
                    <WatchVideoIcon />
                    <Link to={`/course-detail/${props.courseDetail.slug}/watch`}>
                        <span className="text-white">Chuyển đến khóa học</span>
                    </Link>
                </button>
            )}
        </>
    );
};

export default SubscribeUserButton;
