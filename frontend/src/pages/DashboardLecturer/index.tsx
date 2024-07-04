import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable";
import * as Tabs from "@radix-ui/react-tabs";
import StatisticsCard from "../../components/Card/StatisticsCard";
import {
    BanknotesIcon,
    CircleStackIcon,
    GiftIcon,
    PlusCircleIcon,
    BookOpenIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    XCircleIcon,
    ScaleIcon,
    StarIcon,
    ClockIcon,
    UserIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { statisticActions } from "../../redux/slices";
import StatisticsChart from "../../components/Chart/StatisticsBarChart";
import { ScrollArea } from "../../components/ui/scroll-area";
import StatisticLineChart from "../../components/Chart/StatisticLineChart";
import MenuCustomAnimation from "./MenuYearLecturer";
import { Link } from "react-router-dom";
import StatisticDonutChart from "../../components/Chart/StatisticDonutChart";

export function DashboardLecturer() {
    const [tab, setTab] = useState("revenue");
    const dispatch = useAppDispatch();
    const incomeByMonth = useAppSelector((state) => state.statisticSlice.incomeByMonth);
    const enrollByMonth = useAppSelector((state) => state.statisticSlice.enrollByMonth);
    const totalIncomeByOwner = useAppSelector((state) => state.statisticSlice.totalIncomeByOwner);
    const totalEnrollByOwner = useAppSelector((state) => state.statisticSlice.totalEnrollByOwner);
    const courseCountStat = useAppSelector((state) => state.statisticSlice.courseCountStat);
    const top5Enrolled = useAppSelector((state) => state.statisticSlice.top5Enrolled);
    const top5Rate = useAppSelector((state) => state.statisticSlice.top5Rate);
    const incomeByCourse = useAppSelector((state) => state.statisticSlice.incomeByCourse);
    const totalIncomeSaleCourse = useAppSelector((state) => state.statisticSlice.totalIncomeSaleCourse);
    const totalIncomeOriginCourse = useAppSelector((state) => state.statisticSlice.totalIncomeOriginCourse);
    const totalTurnRating = useAppSelector((state) => state.statisticSlice.totalTurnRating);
    const totalPassUnpass = useAppSelector((state) => state.statisticSlice.totalPassUnpass);
    const avgRateAllCourse = useAppSelector((state) => state.statisticSlice.avgRateAllCourse);
    const ratingPercentByOwner = useAppSelector((state) => state.statisticSlice.ratingPercentByOwner);
    const currentYear = new Date().getFullYear();
    useEffect(() => {
        switch (tab) {
            case "revenue":
                dispatch(statisticActions.getIncomeByMonthByOwner(currentYear));
                dispatch(statisticActions.getIncomeByCourseByOwner());
                dispatch(statisticActions.getIncomeByOwner());
                dispatch(statisticActions.getTotalIncomeSaleCourse());
                dispatch(statisticActions.getTotalIncomeOriginCourse());
                break;
            case "course":
                dispatch(statisticActions.getCourseCountByOwner());
                dispatch(statisticActions.getTop5EnrolledCourseByOwner());
                dispatch(statisticActions.getTop5RateCourseByOwner());
                break;
            case "student":
                dispatch(statisticActions.getIncomeByCourseByOwner());
                dispatch(statisticActions.getEnrolledByMonthByOwner(currentYear));
                dispatch(statisticActions.getTotalEnrolledByOwner());
                dispatch(statisticActions.getTotalTurnRating());
                dispatch(statisticActions.getTotalPassUnpass());
                break;
            case "rating":
                dispatch(statisticActions.getRatingPercentByOwner());
                dispatch(statisticActions.getAvgRateAllCourse());
                break;
            default:
                break;
        }
    }, [tab, currentYear, dispatch]);
    const statisticsCardsRevenueData = [
        {
            color: "violet",
            icon: BanknotesIcon,
            title: "Tổng doanh thu các khóa học",
            value: `${totalIncomeByOwner.toLocaleString() || 0}đ`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "gray",
            icon: GiftIcon,
            title: "Doanh thu các khóa học giảm giá",
            value: `${totalIncomeSaleCourse.toLocaleString() || 0}đ`,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "gray",
            icon: CircleStackIcon,
            title: "Doanh thu từ các khóa học giá gốc",
            value: `${totalIncomeOriginCourse.toLocaleString() || 0}đ`,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
    ];
    const statisticsCardsCourseData = [
        {
            color: "blue",
            icon: BookOpenIcon,
            title: "Số lượng khóa học",
            value: `${courseCountStat.course_count || 0}`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "blue",
            icon: EyeIcon,
            title: "Số lượng khóa học đã duyệt",
            value: courseCountStat.course_approve_count || 0,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "blue",
            icon: EyeSlashIcon,
            title: "Số lượng khóa học chưa duyệt",
            value: courseCountStat.course_not_approve_count || 0,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
    ];
    const statisticsCardsStudentData = [
        {
            color: "gray",
            icon: PlusCircleIcon,
            title: "Tổng số lượng tài khoản đăng kí",
            value: `${totalEnrollByOwner || 0}`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "violet",
            icon: PlusCircleIcon,
            title: "Tổng số lượng lượt mua",
            value: totalPassUnpass.total_enrolled || 0,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "gray",
            icon: CheckCircleIcon,
            title: "Học viên đã hoàn thành khóa học",
            value: totalPassUnpass.total_pass || 0,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "gray",
            icon: XCircleIcon,
            title: "Học viên chưa hoàn thành khóa học",
            value: totalPassUnpass.total_unpass || 0,
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
    ];
    const statisticsCardsRatingData = [
        {
            color: "red",
            icon: ScaleIcon,
            title: "Trung bình rating tất cả các khóa của bạn",
            value: `${avgRateAllCourse || 0}`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "blue",
            icon: PencilSquareIcon,
            title: "Tổng số lượt đánh giá",
            value: `${totalTurnRating || 0}`,
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
    ];
    const statisticsChartsData = {
        color: "white",
        colors: "#FFFF00",
        title: "Mỗi khóa học có bao nhiêu doanh thu",
        description: "Mô tả số doanh thu kiếm được từ mỗi khóa học",
        name: "Doanh thu",
        data: incomeByCourse.map((income) => income.total_revenue),
        categories: incomeByCourse.map((_, index) => (index + 1).toString()),
        footer: "Cập nhật ngay bây giờ",
    };
    const statisticsChartsDataEnrolledByCourse = {
        color: "white",
        colors: "#FF0000",
        title: "Mỗi khóa học có bao nhiêu lượt đăng kí",
        description: "Mô tả số lượng đăng kí (mua) thành công cho mỗi khóa học",
        name: "Số lượng",
        data: incomeByCourse.map((e) => e.number_of_enrolled),
        categories: incomeByCourse.map((_, index) => (index + 1).toString()),
        footer: "Cập nhật ngay bây giờ",
    };
    const statisticLineData = {
        color: "white",
        colors: ["#0099FF"],
        title: "Tổng doanh thu theo tháng",
        description: "Mô tả doanh thu của các khóa học của tôi theo 12 tháng trong năm",
        name: "VNĐ",
        data: incomeByMonth.map((month) => month.total_money_month),
        categories: incomeByMonth.map((month) => month.month_label.toString()),
        footer: "Cập nhật ngay bây giờ",
    };
    const statisticLineDataEnrolledByMonth = {
        color: "white",
        colors: ["#00FF00"],
        title: "Tổng số lượt đăng kí khóa học theo tháng",
        description: "Mô tả số lượt đăng kí của các khóa học của bạn theo 12 tháng trong năm",
        name: "Lượt",
        data: enrollByMonth.map((month) => month.total_enroll_month),
        categories: enrollByMonth.map((month) => month.month_label.toString()),
        footer: "Cập nhật ngay bây giờ",
    };
    const statisticDonutDataRating = {
        color: "white",
        title: "Phần trăm khóa học đạt được mức đánh giá từ 1-5",
        description: "Mô tả phần trăm số khóa học đạt được mức đánh giá từ 1-5 của tôi",
        name: "Điểm",
        data:
            ratingPercentByOwner.length > 0
                ? ratingPercentByOwner.map((rating) => rating.percent)
                : [20, 20, 20, 20, 20],
        categories:
            ratingPercentByOwner.length > 0
                ? ratingPercentByOwner.map((rating) => `${rating.title} sao`)
                : "1 sao-2 sao-3 sao-4 sao-5 sao".split("-"),
        footer: "Cập nhật ngay bây giờ",
    };
    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal" className="h-full px-4 tablet:px-[60px]">
                <ResizablePanel defaultSize={20} minSize={20} maxSize={20} className="ml-20">
                    <div className="flex h-full flex-col p-6">
                        <Tabs.Root value={tab} onValueChange={setTab} className="flex flex-col h-full">
                            <Tabs.List className="flex flex-col gap-2">
                                <Tabs.Trigger
                                    value="revenue"
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${
                                        tab === "form" ? "border-blue-400" : "border-transparent"
                                    }`}
                                >
                                    Thống kê doanh thu
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="course"
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${
                                        tab === "target" ? "border-blue-400" : "border-transparent"
                                    }`}
                                >
                                    Thống kê khóa học
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="student"
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${
                                        tab === "section" ? "border-blue-400" : "border-transparent"
                                    }`}
                                >
                                    Thống kê học viên
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="rating"
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${
                                        tab === "promotion" ? "border-blue-400" : "border-transparent"
                                    }`}
                                >
                                    Thống kê đánh giá và phản hồi
                                </Tabs.Trigger>
                            </Tabs.List>
                        </Tabs.Root>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className="flex flex-col h-full p-6">
                        <Tabs.Root value={tab} onValueChange={setTab} className="w-full h-full">
                            <Tabs.Content
                                value="revenue"
                                className={`w-full h-full ${tab === "revenue" ? "flex" : "hidden"} flex-col`}
                            >
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 w-full">
                                    {statisticsCardsRevenueData.map(({ icon, title, footer, ...rest }) => {
                                        return (
                                            <StatisticsCard
                                                key={title}
                                                {...rest}
                                                title={title}
                                                value={rest.value}
                                                icon={icon}
                                                // icon={React.createElement(icon, {
                                                //     className: "w-6 h-6 text-white",
                                                // })}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2 w-full">
                                    <StatisticsChart
                                        key={statisticsChartsData.title}
                                        {...statisticsChartsData}
                                        footer={
                                            <p className="flex items-center text-sm font-normal text-blue-gray-600">
                                                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                                &nbsp;{statisticsChartsData.footer}
                                            </p>
                                        }
                                    />
                                    <StatisticLineChart
                                        key={statisticLineData.title}
                                        {...statisticLineData}
                                        footer={
                                            <div className="flex justify-between">
                                                <p className="flex text-sm items-center font-normal text-blue-gray-600">
                                                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                                    &nbsp;{statisticLineData.footer}
                                                </p>
                                                <div className="flex gap-2">
                                                    <p className="flex text-sm items-center font-normal text-blue-gray-600">
                                                        Năm
                                                    </p>
                                                    <MenuCustomAnimation />
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                                <div className="w-1/2 -mt-8 ">
                                    <ScrollArea className="h-60 w-72 w-auto rounded-md border">
                                        <table
                                            className="min-w-full bg-white border border-gray-200"
                                            style={{ overflow: "auto" }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 border-b border-gray-200">Số thứ tự</th>
                                                    <th className="px-4 py-2 border-b border-gray-200">
                                                        Tiêu Đề Khóa Học
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomeByCourse.map((course: any, index) => (
                                                    <tr key={course.course_id} style={{ overflow: "auto" }}>
                                                        <td
                                                            className="px-4 py-2 border-b border-gray-200 text-center"
                                                            style={{ overflow: "auto" }}
                                                        >
                                                            <Link to={`/course-detail/${course.course_slug}`}>
                                                                {index + 1}
                                                            </Link>
                                                        </td>
                                                        <td
                                                            className="px-4 py-2 border-b border-gray-200 text-center"
                                                            style={{ overflow: "auto" }}
                                                        >
                                                            <Link to={`/course-detail/${course.course_slug}`}>
                                                                {course.course_title}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </ScrollArea>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content
                                value="course"
                                className={`w-full h-full  ${tab === "course" ? "flex" : "hidden"} flex-col`}
                            >
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 w-full">
                                    {statisticsCardsCourseData.map(({ icon, title, footer, ...rest }) => {
                                        return (
                                            <StatisticsCard
                                                key={title}
                                                {...rest}
                                                title={title}
                                                value={rest.value}
                                                icon={icon}
                                                // icon={React.createElement(icon, {
                                                //     className: "w-6 h-6 text-white",
                                                // })}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2 w-full">
                                    <table
                                        className="min-w-full bg-white border border-gray-200"
                                        style={{ overflow: "auto" }}
                                    >
                                        <caption style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
                                            Thống kê 5 khóa học có lượt đăng kí cao nhất
                                        </caption>

                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border-b border-gray-200">Ảnh khóa học</th>
                                                <th className="px-4 py-2 border-b border-gray-200">Tiêu Đề Khóa Học</th>
                                                <th className="px-4 py-2 border-b border-gray-200">
                                                    Số lượng học viên
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {top5Enrolled.map((course: any) => (
                                                <tr key={course.id} style={{ overflow: "auto" }}>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <Link to={`/course-detail/${course.slug}`}>
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="h-12 w-12 object-cover"
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <Link to={`/course-detail/${course.slug}`}>{course.title}</Link>
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            {course.number_of_enrolled}
                                                            <UserIcon className="w-7 h-7 text-blue-500 ml-1 mb-1" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <table
                                        className="min-w-full bg-white border border-gray-200"
                                        style={{ overflow: "auto" }}
                                    >
                                        <caption style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
                                            Thống kê 5 khóa học có lượt đánh giá cao nhất
                                        </caption>
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border-b border-gray-200">Ảnh khóa học</th>
                                                <th className="px-4 py-2 border-b border-gray-200">Tiêu Đề Khóa Học</th>
                                                <th className="px-4 py-2 border-b border-gray-200">
                                                    Lượt đánh giá trung bình
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {top5Rate.map((course: any) => (
                                                <tr key={course.id} style={{ overflow: "auto" }}>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <Link to={`/course-detail/${course.slug}`}>
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.title}
                                                                className="h-12 w-12 object-cover"
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <Link to={`/course-detail/${course.slug}`}>{course.title}</Link>
                                                    </td>
                                                    <td
                                                        className="px-4 py-2 border-b border-gray-200 text-center"
                                                        style={{ overflow: "auto" }}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            {course.average_rating}
                                                            <StarIcon className="w-7 h-7 text-yellow-500 ml-1 mb-1" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content
                                value="student"
                                className={`w-full h-full ${tab === "student" ? "flex" : "hidden"} flex-col`}
                            >
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 w-full">
                                    {statisticsCardsStudentData.map(({ icon, title, footer, ...rest }) => {
                                        return (
                                            <StatisticsCard
                                                key={title}
                                                {...rest}
                                                title={title}
                                                value={rest.value}
                                                icon={icon}
                                                // icon={React.createElement(icon, {
                                                //     className: "w-6 h-6 text-white",
                                                // })}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2 w-full">
                                    <StatisticsChart
                                        key={statisticsChartsDataEnrolledByCourse.title}
                                        {...statisticsChartsDataEnrolledByCourse}
                                        footer={
                                            <p className="flex items-center text-sm font-normal text-blue-gray-600">
                                                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                                &nbsp;{statisticsChartsDataEnrolledByCourse.footer}
                                            </p>
                                        }
                                    />
                                    <StatisticLineChart
                                        key={statisticLineDataEnrolledByMonth.title}
                                        {...statisticLineDataEnrolledByMonth}
                                        footer={
                                            <div className="flex justify-between">
                                                <p className="flex text-sm items-center font-normal text-blue-gray-600">
                                                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                                    &nbsp;{statisticLineDataEnrolledByMonth.footer}
                                                </p>
                                                <div className="flex gap-2">
                                                    <p className="flex text-sm items-center font-normal text-blue-gray-600">
                                                        Năm
                                                    </p>
                                                    <MenuCustomAnimation />
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                                <div className="w-1/2 -mt-8 ">
                                    <ScrollArea className="h-60 w-72 w-auto rounded-md border">
                                        <table
                                            className="min-w-full bg-white border border-gray-200"
                                            style={{ overflow: "auto" }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 border-b border-gray-200">Số thứ tự</th>
                                                    <th className="px-4 py-2 border-b border-gray-200">
                                                        Tiêu Đề Khóa Học
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomeByCourse.map((course: any, index) => (
                                                    <tr key={course.course_id} style={{ overflow: "auto" }}>
                                                        <td
                                                            className="px-4 py-2 border-b border-gray-200 text-center"
                                                            style={{ overflow: "auto" }}
                                                        >
                                                            <Link to={`/course-detail/${course.course_slug}`}>
                                                                {index + 1}
                                                            </Link>
                                                        </td>
                                                        <td
                                                            className="px-4 py-2 border-b border-gray-200 text-center"
                                                            style={{ overflow: "auto" }}
                                                        >
                                                            <Link to={`/course-detail/${course.course_slug}`}>
                                                                {course.course_title}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </ScrollArea>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content
                                value="rating"
                                className={`w-full h-full ${tab === "rating" ? "flex" : "hidden"} flex-col`}
                            >
                                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 w-full">
                                    {statisticsCardsRatingData.map(({ icon, title, footer, ...rest }, index) => {
                                        return (
                                            <StatisticsCard
                                                key={title}
                                                {...rest}
                                                title={title}
                                                value={
                                                    <div className="flex items-center justify-end">
                                                        {rest.value}
                                                        {index === 0 && (
                                                            <StarIcon className="w-6 h-6 text-yellow-500 ml-1" />
                                                        )}
                                                    </div>
                                                }
                                                icon={icon}
                                            />
                                        );
                                    })}
                                </div>
                                <StatisticDonutChart
                                    key={statisticDonutDataRating.title}
                                    {...statisticDonutDataRating}
                                    footer={
                                        <p className="flex text-sm items-center font-normal text-blue-gray-600">
                                            <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                                            &nbsp;{statisticDonutDataRating.footer}
                                        </p>
                                    }
                                />
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
export default DashboardLecturer;
