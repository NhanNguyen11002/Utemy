import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { reportActions } from "../../../redux/slices";
import { Pagination, AllReportCard } from "../../../components";
import { ReportType as Report } from "../../../types/report";

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
        dispatch(reportActions.getAllReportWithPagination({ pageIndex, keyword }));
    }, [keyword, pageIndex]);
    return (
        <>
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2 ">
                <div className="relative w-[60%]">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Từ khóa..."
                        className="rounded-full py-4 px-10 w-full border-[1px] border-black"
                        value={userInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleKeyWordSearch();
                        }}
                    />
                    <div className="cursor-pointer absolute bottom-5 left-4 " onClick={handleKeyWordSearch}>
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                </div>
                <div className="grid grid-cols-1 w-2/3">
                    {reports.length > 0 ? (
                        reports.map((report, index) => {
                            return (
                                <div key={index}>
                                    <AllReportCard report={report} key={index} />
                                </div>
                            );
                        })
                    ) : (
                        <p className={`text-lg mt-2 `}>Có vẻ như không có báo cáo đến khoá học nào</p>
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