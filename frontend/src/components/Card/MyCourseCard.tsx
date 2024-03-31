import { FC } from "react";
import { Link } from "react-router-dom";
import ThreeDotIcon from "../../assets/icons/ThreedotIcon";
import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { User } from "../../types/user";
import TotalRating from "../TotalRating";
import { convertDateFormat, calDayRemains } from "../../utils/helper";

type Course = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
    author: User;
    price?: number;
    salePrice?: number;
    saleUntil?: string | Date | undefined;
    rating?: number;
    status?: boolean;
    numberOfSection?: number;
    attendees?: number;
    isEditCourse?: boolean;
    createdAt?: string;
    enrolled: boolean;
    handleDeleteCourse?: (courseId: number) => void;
    handleEditCourse?: (id: number) => void;
    handleDisplayDeleteModal?: (courseId: number) => void;
};
const MyCourseCard: FC<Course> = (props: Course) => {
    const hasAttendee = props.attendees !== undefined;
    const hasPrice = props.price || props.price === 0;
    const hasSectionCount = props.numberOfSection !== undefined;
    const convertedDate = convertDateFormat(props.createdAt as string);
    const hasSalePrice =
        props.salePrice &&
        props.price &&
        props.salePrice < props.price &&
        props.saleUntil &&
        new Date(props.saleUntil) > new Date();
    let dayRemains = undefined;
    if (hasSalePrice) dayRemains = calDayRemains(props.saleUntil as string);
    return (
        <div className="py-2">
            <div className="flex flex-col gap-2 tablet:gap-4 tablet:flex-row rounded-2xl hover:bg-lightblue/25 transition ease-in-out hover:shadow-lg duration-200 shadow-lg">
                <div className="h-48 bg-gray-400 rounded-lg tablet:w-64 shrink-0">
                    <Link to={`${props.isEditCourse ? "/lecturer" : ""}/course-detail/${props.slug}`}>
                        <img src={props.thumbnail} alt={props.title} className="w-full h-full rounded-lg" />
                    </Link>
                </div>
                <div className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0">
                    <div className="w-[90%] tablet:w-full">
                        <h2 className="tablet:w-[300px] xl:w-[600px] text-xl font-bold text-title truncate">
                            {props.title}
                        </h2>
                        <p className="text-base italic">{props.summary}</p>
                        <p className="text-base font-bold">
                            <span>Tác giả: </span>
                            <Link to={`/profile/${props.author.user_id}`} className="text-blue-600 font-normal">
                                {props.author.first_name + " " + props.author.last_name}
                            </Link>
                        </p>

                        <div className="text-base flex items-center gap-1">
                            <span className=" font-bold">Đánh giá: </span>
                            <TotalRating
                                ratingId={Number(props.id)}
                                totalScore={props.rating as number}
                                isForCourse={false}
                            />
                            <span>{props.rating}</span>
                        </div>

                        {props.enrolled ? (
                            <></>
                        ) : (
                            <p className="text-base font-bold flex gap-1">
                                Status:{" "}
                                {props.status ? (
                                    <span className="font-normal flex gap-1 items-center">
                                        Đã được duyệt{" "}
                                        <CheckBadgeIcon className="w-5 h-5 fill-green-400" strokeWidth={2} />
                                    </span>
                                ) : (
                                    <span className="font-normal flex gap-1 items-center">
                                        Đang chờ duyệt{" "}
                                        <LockClosedIcon className="w-5 h-5 fill-red-400" strokeWidth={2} />
                                    </span>
                                )}
                            </p>
                        )}

                        {hasAttendee && (
                            <p className="text-base font-bold">
                                Số học viên: <span className="font-normal">{props.attendees}</span>
                            </p>
                        )}
                        {hasPrice &&
                            (hasSalePrice ? (
                                <p className="text-base font-bold">
                                    Giá:
                                    <span className=" font-extrabold font-OpenSans text-lightblue ">
                                        {" "}
                                        {props.salePrice?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                    <span className="font-normal italic text-xs line-through">
                                        {" "}
                                        {props.price?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                    <span className=" font-extrabold font-OpenSans text-lightblue ">
                                        {" "}
                                        {dayRemains} days left
                                    </span>{" "}
                                </p>
                            ) : (
                                <p className="text-base font-bold">
                                    Giá:
                                    <span className="font-extrabold font-OpenSans">
                                        {" "}
                                        {props.price?.toLocaleString()}đ{" "}
                                    </span>{" "}
                                </p>
                            ))}
                        {hasSectionCount && (
                            <p className="text-base font-bold">
                                Số chương học:
                                <span className="font-normal"> {props.numberOfSection} </span>{" "}
                            </p>
                        )}
                        {props.createdAt && (
                            <p className="text-base font-bold">
                                Ngày tạo: <span className="font-normal">{convertedDate}</span>
                            </p>
                        )}
                    </div>

                    {props.isEditCourse ? (
                        <div className="dropdown dropdown-right">
                            <div tabIndex={0} role="button" className="btn btn-circle btn-sm m-1">
                                <ThreeDotIcon />
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <div
                                        className="flex items-center p-2 rounded-lg  hover:bg-footer cursor-pointer"
                                        onClick={() => {
                                            if (props.handleEditCourse) props.handleEditCourse(props.id);
                                        }}
                                    >
                                        <EditIcon />
                                        <span className="ml-2 w-full">Chỉnh sửa</span>
                                    </div>
                                </li>
                                <li>
                                    <div
                                        className="flex items-center p-2 rounded-lg hover:bg-footer cursor-pointer"
                                        onClick={() => {
                                            if (props.handleDisplayDeleteModal)
                                                props.handleDisplayDeleteModal(props.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                        <span className="ml-2">Xóa</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourseCard;
