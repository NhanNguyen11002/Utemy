import React from "react";
import { Link } from "react-router-dom";
import { WatchVideoIcon } from "../../assets/icons";
import { Course as CourseDetailType } from "../../types/course";
import { useAppDispatch } from "../../hooks/hooks";
import { lectureActions } from "../../redux/slices";
type AuthorButtonProps = {
    handleTogglePromotion(): void;
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorButton: React.FC<AuthorButtonProps> = (props) => {
    const dispatch = useAppDispatch();
    const clearUrlVideo = () => {
        dispatch(lectureActions.setLecture({}));
    };
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <Link to={`/course-detail/${props.courseDetail.slug}/watch`} onClick={clearUrlVideo}>
                    <button className="text-white btn btn-sm btn-info hover:opacity-80 ">
                        <WatchVideoIcon />
                        <span>Chuyển đến khóa học</span>
                    </button>
                </Link>
            )}
        </>
    );
};

export default AuthorButton;
