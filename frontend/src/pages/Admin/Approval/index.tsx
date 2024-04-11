import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { approvalActions } from "../../../redux/slices";
import { Pagination, ApprovalCard } from "../../../components";
import { ApprovalCard as Approval } from "../../../types/approval";

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
                <div className="flex flex-col w-2/3">
                    {approvals.length > 0 ? (
                        approvals.map((approval, index) => {
                            return (
                                <div key={index}>
                                    <ApprovalCard approval={approval} key={index} />
                                </div>
                            );
                        })
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
