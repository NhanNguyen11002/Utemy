import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { reportActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import { ReportType as Report } from "../../../types/report";

import { convertDateFormat } from "../../../utils/helper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

// import { Pagination } from "../../../components";
// import { TotalRating } from "../../../components";

export function ReportAdmin() {
    const [userInput, setUserInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const reports: Report[] = useAppSelector((state) => state.reportSlice.reports) || [];
    const [pageIndex, setPageIndex] = useState(1);
    const totalPage = useAppSelector((state) => state.reportSlice.totalPage) || 0;
    const [keyword, setKeyword] = useState("");
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setKeyword(userInput);
        setUserInput("");
    };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    useEffect(() => {
        dispatch(reportActions.getAllReportWithPagination({ pageIndex: 1, keyword }));
    }, [keyword]);
    useEffect(() => {
        dispatch(reportActions.getAllReportWithPagination({ pageIndex, keyword }));
    }, [pageIndex]);
    return (
        <>
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2 gap-4 ">
                <div className="relative w-[40%]">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Từ khóa..."
                        id="search-report"
                        className="rounded-full py-2 px-10 w-full border-[1px] border-black"
                        value={userInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleKeyWordSearch();
                        }}
                    />
                    <div className="cursor-pointer absolute bottom-3 left-4 " onClick={handleKeyWordSearch}>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex flex-col w-2/3">
                    {reports.length > 0 ? (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="border">Khoá học</TableHead>
                                    <TableHead className="text-center border">Ngày gửi báo cáo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <Link
                                                to={`/admin/course/${report.course.slug}#report`}
                                                className="hover:cursor-pointer"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className=" rounded-sm">
                                                            <AvatarImage src={report.course.thumbnail} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className="title-card-content">{report.course.title}</p>
                                                    </div>
                                                </TableCell>
                                            </Link>
                                            <TableCell className="text-center border">
                                                {" "}
                                                <p>{convertDateFormat(report.created_at.toString())}</p>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className={`text-lg mt-2 `}>
                            Có vẻ như không có báo cáo tới khoá học nào{" "}
                            {keyword !== "" && (
                                <span>
                                    {" "}
                                    có từ khoá <span className="italic">"{keyword}"</span>
                                </span>
                            )}
                        </p>
                    )}
                </div>
                {totalPage > 1 && (
                    <div className="flex justify-end my-4">
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

export default ReportAdmin;
