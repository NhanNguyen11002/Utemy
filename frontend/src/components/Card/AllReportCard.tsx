import { FC, useState } from "react";
import { Link } from "react-router-dom";
// import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ReportType as Report } from "../../types/report";
import { convertDateFormat } from "../../utils/helper";

type AllReportCardProps = {
    report: Report;
};
const AllReportCard: FC<AllReportCardProps> = ({ report }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div className="py-2">
            <div className="flex gap-2 tablet:gap-4 rounded-2xl border-gray-300 border shadow-md w-full h-fit">
                <div className="h-fit w-[20%] bg-background_2 shrink-0">
                    <img src={report.course.thumbnail} alt={"course_thumnail"} className="w-[200px] h-[140px]" />
                </div>
                <Link to={`/admin/course/${report.course.slug}/`} className={`w-full`}>
                    <div
                        className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0 w-[full] h-full relative"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <div className={`w-[90%] tablet:w-full p-2 transition-all duration-300`}>
                            <h2 className="w-full text-xl font-bold title-card-content ">{report.course.title}</h2>
                            <p>Báo cáo khoá học vào ngày {convertDateFormat(report.created_at.toString())}</p>
                            <p
                                className={`text-lg font-medium text-blue-500 ${hovered ? "block" : "hidden"} hover:underline transition-all duration-500`}
                            >
                                Xem chi tiết
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AllReportCard;
