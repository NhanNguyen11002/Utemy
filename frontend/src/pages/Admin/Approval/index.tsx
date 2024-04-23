import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { approvalActions } from "../../../redux/slices";
import { Pagination } from "../../../components";
import { ApprovalCard as Approval } from "../../../types/approval";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { convertDateFormat } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";

// import { Pagination } from "../../../components";
// import { TotalRating } from "../../../components";

export function ApprovalAdmin() {
    const [userInput, setUserInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const approvals: Approval[] = useAppSelector((state) => state.approvalSlice.approvals) || [];
    const [pageIndex, setPageIndex] = useState(1);
    const totalPage = useAppSelector((state) => state.approvalSlice.totalPage) || 0;
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
        dispatch(approvalActions.getApprovalsWithPagenation({ pageIndex, keyword }));
    }, [keyword, pageIndex]);
    return (
        <>
            <div className="pt-[15px] flex flex-col items-center min-h-screen bg-background_2 gap-4 ">
                <div className="relative w-[40%]">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Từ khóa..."
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
                    {approvals.length > 0 ? (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="border">Khoá học</TableHead>
                                    <TableHead className="text-center border">Ngày gửi yêu cầu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvals.map((approval, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <Link
                                                to={`/admin/course/${approval.course_slug}/`}
                                                className="hover:cursor-pointer"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className=" rounded-sm">
                                                            <AvatarImage src={approval.course_thumbnail} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className="title-card-content">{approval.course_title}</p>
                                                    </div>
                                                </TableCell>
                                            </Link>
                                            <TableCell className="text-center border">
                                                {" "}
                                                <p>{convertDateFormat(approval.created_at.toString())}</p>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className={`text-lg mt-2 `}>Có vẻ như không có đơn yêu cầu được xét duyệt khoá học nào</p>
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

export default ApprovalAdmin;
