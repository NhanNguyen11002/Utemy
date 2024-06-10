import { ReportCard, Pagination } from "../../../components";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { useState, useEffect } from "react";
import { reportActions } from "../../../redux/slices";

const ReportTab = () => {
    const dispatch = useAppDispatch();
    const reports = useAppSelector((state) => state.reportSlice.reports) || [];
    const course_id = useAppSelector((state) => state.courseSlice.courseDetail.course_id);
    const [pageIndex, setPageIndex] = useState(1);
    const totalPage = useAppSelector((state) => state.reportSlice.totalPage) || 0;
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
        dispatch(reportActions.getReportByCourseId({ course_id, page_index: pageIndex }));
    }, [pageIndex]);
    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Báo cáo khoá học</p>
            </div>
            <div className="p-6 pr-24 ">
                <p className="mt-2 mb-4">
                    Đây sẽ là trang mà bạn xem xét các báo cáo nhắm tới khoá học này vì nhiều lí do, nhiệm vụ của bạn là
                    xét duyệt các báo cáo đó, kiểm tra xác thực báo cáo và đưa ra quyết định dựa trên kết quả đó
                </p>
                <div className="mt-2 mb-4">
                    <p className="font-bold">Danh sách các báo cáo nhắm đến khoá học này</p>
                    <div className="grid grid-cols-2 gap-2 items-center">
                        {reports.length > 0 ? (
                            reports.map((report: any) => {
                                return <ReportCard key={report.report_id} report={report} />;
                            })
                        ) : (
                            <p className="my-1 self-start">Khoá học không có báo cáo nào</p>
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
            </div>
        </div>
    );
};
export default ReportTab;
