import React from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon, GiftIcon } from "../../assets/icons";
import { Course as CourseDetailType } from "../../types/course";
import { ThreedotIcon } from "../../assets/icons";
type AuthorDropdownProps = {
    handleTogglePromotion(): void;
    handleDelete(): void;
    courseDetail: CourseDetailType;
};

const AuthorDropdown: React.FC<AuthorDropdownProps> = (props) => {
    return (
        <>
            <div className="dropdown dropdown-right ">
                <div tabIndex={0} role="button" className="btn btn-xs btn-circle m-1 bg-inherit border-0 ">
                    <ThreedotIcon />
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <Link to={`/lecturer/courses/edit/${props.courseDetail.course_id}`}>
                            <span className="flex text-black text-xl items-center gap-2">
                                <EditIcon color="#000000" />

                                <span>Chỉnh sửa</span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <span
                            onClick={() => {
                                props.handleTogglePromotion();
                            }}
                            className="flex text-black text-xl items-center gap-2"
                        >
                            <GiftIcon />
                            <span>Giảm giá</span>
                        </span>
                    </li>
                    <li>
                        <span
                            onClick={() => {
                                props.handleDelete();
                            }}
                            className="flex text-black text-xl items-center gap-2"
                        >
                            <DeleteIcon color="#000000" />
                            <span>Xóa</span>
                        </span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default AuthorDropdown;
