import React from "react";
import { Link } from "react-router-dom";
import { WatchVideoIcon } from "../../assets/icons";
import { Course as CourseDetailType } from "../../types/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { lectureActions } from "../../redux/slices";
type AuthorButtonProps = {
    handleTogglePromotion(): void;
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorButton: React.FC<AuthorButtonProps> = (props) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin) ?? false;
    const dispatch = useAppDispatch();
    const clearUrlVideo = () => {
        dispatch(lectureActions.setLecture({}));
    };
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <Link
                    to={`${isAdmin ? "/admin" : ""}/course-detail/${props.courseDetail.slug}/watch`}
                    onClick={clearUrlVideo}
                >
                    <button className=" btn btn-sm btn-info hover:opacity-80 ">
                        <WatchVideoIcon />
                        <span className="text-white">Chuyển đến khóa học</span>
                    </button>
                </Link>
            )}
        </>
    );
};

export default AuthorButton;
