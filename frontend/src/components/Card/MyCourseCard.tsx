import { FC, useState } from "react";
import { Link } from "react-router-dom";
// import ThreeDotIcon from "../../assets/icons/ThreedotIcon";
// import EditIcon from "../../assets/icons/EditIcon";
// import DeleteIcon from "../../assets/icons/DeleteIcon";
// import { convertDateFormat, calDayRemains } from "../../utils/helper";
// import { User } from "../../types/user";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import TotalRating from "../TotalRating";
import { Course } from "../../types/course";
import { Progress } from "../ui/progress";
import { courseSetupProgress } from "../../utils/helper";

type MyCourseCardProps = {
    course: Course;
};
const MyCourseCard: FC<MyCourseCardProps> = ({ course }) => {
    const [hovered, setHovered] = useState(false);
    const progress = courseSetupProgress(course);
    return (
        <div className="py-2">
            <div className="flex flex-col gap-2 tablet:gap-4 tablet:flex-row rounded-2xl border-gray-300 border w-full">
                <div className="h-48 bg-gray-400 tablet:w-64 shrink-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full" />
                </div>
                <Link to={`/lecturer/course/edit/${course.course_id}`} className=" w-full">
                    <div
                        className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0 relative"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <div
                            className={`absolute top-1/2 left-1/3 ${hovered ? "block" : "hidden"} transition-all duration-500`}
                        >
                            <p className="text-lg font-medium text-blue-500">Chỉnh sửa/Quản lý khoá học</p>
                        </div>
                        <div
                            className={`w-[90%] tablet:w-full p-2 ${hovered && "blur-lg"} transition-all duration-300`}
                        >
                            <h2 className="w-full text-xl font-bold title-card-content ">{course.title}</h2>

                            <div className="text-base flex items-center gap-1">
                                <span>{course.average_rating}</span>
                                <TotalRating
                                    ratingId={Number(course.course_id)}
                                    totalScore={course.average_rating as number}
                                    isForCourse={false}
                                />
                            </div>

                            <p className="text-base font-bold flex gap-1">
                                Trạng thái:{" "}
                                {course.status ? (
                                    <span className="font-normal flex gap-1 items-center">
                                        Đã được duyệt{" "}
                                        <CheckBadgeIcon className="w-5 h-5 fill-green-400" strokeWidth={2} />
                                    </span>
                                ) : (
                                    <span className="font-normal flex gap-1 items-center">
                                        Bị hạn chế <LockClosedIcon className="w-5 h-5 fill-red-400" strokeWidth={2} />
                                    </span>
                                )}
                            </p>
                            <p className="text-base font-bold">
                                Số học viên: <span className="font-normal">{course.number_of_enrolled}</span>
                            </p>
                            <div className="flex flex-col items-start w-full mr-2">
                                <p>Mức độ hoàn thiện</p>
                                <Progress value={progress} className="h-[10px] text-blue-400" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default MyCourseCard;
