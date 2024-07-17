import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import MenuDropdown from "./MenuDropdown";
import { RankLecturer } from "../../../types/statistic";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Link } from "react-router-dom";
import { statisticActions } from "../../../redux/slices";
import { Pagination, Spin } from "../../../components";
import defaultAvatar from "../../../assets/images/default-avatar.png";
export function RankLecturerTab() {
    const dispatch = useAppDispatch();
    const [option, setOption] = useState("Số học viên");
    const [pageIndex, setPageIndex] = useState(1);
    const rankLecturers: RankLecturer[] = useAppSelector((state) => state.statisticSlice.rankLecturers); // lấy danh sách giảng viên từ đây r bỏ vào bảng
    const totalPage = useAppSelector((state) => state.statisticSlice.totalPage);
    const isGetLoading = useAppSelector((state) => state.statisticSlice.isGetLoading);

    useEffect(() => {
        handleChangeCriteria(pageIndex, option);
    }, [dispatch, pageIndex]);
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleChangeCriteria = (pageIndex: number, criteria: string) => {
        if (criteria === "Số học viên") {
            dispatch(statisticActions.getRankLecturersByEnrolled(pageIndex));
        }
        if (criteria === "Đánh giá") {
            dispatch(statisticActions.getRankLecturersByRating(pageIndex));
        }
        if (criteria === "Doanh thu") {
            dispatch(statisticActions.getRankLecturersByIncome(pageIndex));
        }
        if (criteria === "Số lượt báo cáo") {
            dispatch(statisticActions.getRankLecturersByReport(pageIndex));
        }
    };
    const dropdownProps = [
        {
            text: "Số học viên",
            onClickHandle: () => {
                //dispatch
                setOption("Số học viên");
                handleChangeCriteria(1, "Số học viên");
            },
        },
        {
            text: "Đánh giá",
            onClickHandle: () => {
                //dispatch
                setOption("Đánh giá");
                handleChangeCriteria(1, "Đánh giá");
            },
        },
        {
            text: "Doanh thu",
            onClickHandle: () => {
                //dispatch
                setOption("Doanh thu");
                handleChangeCriteria(1, "Doanh thu");
            },
        },
        {
            text: "Số lượt báo cáo",
            onClickHandle: () => {
                //dispatch
                setOption("Số lượt báo cáo");
                handleChangeCriteria(1, "Số lượt báo cáo");
            },
        },
    ];
    return (
        <>
            {isGetLoading && <Spin />}

            <div className="min-h-screen bg-background_2">
                <div className="flex mb-1 items-center gap-2">
                    <MenuDropdown items={dropdownProps} />
                    {rankLecturers.length > 0 && (
                        <p className="italic">
                            Thứ hạng: {`${(pageIndex - 1) * 10 + 1} - ${(pageIndex - 1) * 10 + 10}`}
                        </p>
                    )}
                </div>
                {rankLecturers.length > 0 ? (
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="border">Khoá học</TableHead>
                                <TableHead className="text-center border">{option}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankLecturers.map((lecturer, index) => {
                                const stat =
                                    option === "Số học viên"
                                        ? lecturer.number_of_enrolled
                                        : option === "Đánh giá"
                                          ? lecturer.average_rating
                                          : option === "Doanh thu"
                                          ? lecturer.total_income_this_lecturer !== undefined && lecturer.total_income_this_lecturer !== 0
                                          ? lecturer.total_income_this_lecturer.toLocaleString()
                                          : lecturer.total_income_this_lecturer
                                            : lecturer.total_report_this_lecturer;
                                return (
                                    <TableRow key={index}>
                                        <Link
                                            to={`/admin/user-profile/${lecturer.lecturer_id}`}
                                            className="hover:cursor-pointer"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className=" rounded-sm">
                                                        <AvatarImage src={lecturer.url_avt || defaultAvatar} />
                                                    <AvatarFallback>UtemyVip</AvatarFallback>
                                                    </Avatar>
                                                    <p className="title-card-content">
                                                        {`${lecturer.first_name} ${lecturer.last_name}`} {}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </Link>
                                        <TableCell className="text-center border">
                                            {" "}
                                            <p>
                                                {stat?.toLocaleString() || ""} {option === "Doanh thu" && "VND"}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <p>Hệ thống thiếu data để tổng hợp</p>
                )}
                {totalPage > 1 && (
                    <div className="flex justify-start my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default RankLecturerTab;
