import { FC } from "react";
import { Link } from "react-router-dom";
import TotalRating from "../TotalRating";
import { convertDateFormat } from "../../utils/helper";
import { Progress } from "../ui/progress";
import { Course } from "../../types/course";
type MyEnrolledCourseCardProps = {
    enrolledCourse: Course;
};
const MyEnrolledCourseCard: FC<MyEnrolledCourseCardProps> = ({ enrolledCourse }) => {
    const convertedDate = convertDateFormat(enrolledCourse.updated_at as string);
    const progress =
        enrolledCourse.overall_progress &&
        enrolledCourse.number_of_lecture &&
        (enrolledCourse.overall_progress / enrolledCourse.number_of_lecture) * 100;
    return (
        <div className="py-2">
            <div className="flex flex-col gap-2 tablet:gap-4 tablet:flex-row rounded-2xl hover:bg-lightblue/25 transition ease-in-out hover:shadow-lg duration-200 shadow-lg">
                <div className="h-48 bg-gray-400 rounded-lg tablet:w-64 shrink-0">
                    <Link to={`/course-detail/${enrolledCourse.slug}`}>
                        <img
                            src={enrolledCourse.thumbnail}
                            alt={enrolledCourse.title}
                            className="w-full h-full rounded-lg"
                        />
                    </Link>
                </div>
                <div className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0">
                    <div className="w-full flex flex-col gap-[1px]">
                        <h2 className="w-full text-xl font-bold title-card-content">{enrolledCourse.title}</h2>
                        {/* <p className="w-full text-sm italic tablet:block hidden line-clamp-2 ">
                            {enrolledCourse.summary}
                        </p> */}
                        <p className="text-base font-bold">
                            <span>Tác giả: </span>
                            <Link
                                to={`/profile/${enrolledCourse.author?.user_id}`}
                                className="text-blue-600 font-normal"
                            >
                                {enrolledCourse.author?.first_name + " " + enrolledCourse.author?.last_name}
                            </Link>
                        </p>

                        <div className="text-base flex items-center gap-1">
                            <span className=" font-bold">Đánh giá: </span>
                            <TotalRating
                                ratingId={Number(enrolledCourse.course_id)}
                                totalScore={enrolledCourse.average_rating as number}
                                isForCourse={false}
                            />
                            <span>{enrolledCourse.average_rating}</span>
                        </div>
                        <p className="text-base font-bold">
                            Cập nhật gần nhất: <span className="font-normal">{convertedDate}</span>
                        </p>
                        <div className="flex flex-col items-start w-full pr-2  gap-[5px]">
                            <p className="font-bold">
                                Tiến độ học tập của bạn: <span>{progress?.toFixed(2) || 0}%</span>
                            </p>
                            <Progress value={progress || 0} className="h-[10px] w-full text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEnrolledCourseCard;
