import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Presentation, ClipboardX } from "lucide-react";
import { convertDateFormat } from "../../utils/helper";
import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useAppDispatch } from "../../hooks/hooks";
import { reportActions } from "../../redux/slices";
import toast from "react-hot-toast";
import { ReportType } from "../../types/report";
type ReportCardProps = {
    report: ReportType;
};
const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    const dispatch = useAppDispatch();
    const [hovered, setHovered] = useState(false);
    const title = report.is_lecture
        ? report.lecture && report.lecture.content
            ? report.lecture.content.title
            : report.course.title
        : report.course.title;
    console.log(title);
    const handleOnClick = () => {
        dispatch(reportActions.handleReport(report.report_id)).then((res) => {
            if (res && res.payload) {
                if (res.payload.status_code === 200) {
                    toast.success(res.payload.message);
                    dispatch(reportActions.setHandleReport(report.report_id));
                } else {
                    toast.error(res.payload.message);
                }
            }
        });
    };

    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>
                    <>
                        <div
                            className={`border border-gray-300 p-4 flex items-center justify-between hover:cursor-pointer ${report.is_handle && "opacity-60"}`}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            onClick={() => setHovered(false)}
                        >
                            <DialogTrigger className="w-[90%]">
                                <div className="flex items-center justify-start gap-3 text-start">
                                    {report.is_lecture ? (
                                        <ClipboardX className="w-5 h-5 fill-red-500" />
                                    ) : (
                                        <Presentation className="w-5 h-5 fill-red-500" />
                                    )}
                                    <div>
                                        <div className="flex gap-2">
                                            <p className={`${report.is_lecture ? "text-[#ff9966]" : "text-[#ffcc00]"}`}>
                                                #
                                                <span className="font-bold">
                                                    {report.is_lecture ? "bài học" : "khoá học"}
                                                </span>{" "}
                                            </p>
                                            <p className={`${hovered ? "block" : "hidden"} hover:underline`}>
                                                Xem chi tiết
                                            </p>
                                        </div>
                                        <p>Ngày tạo: {convertDateFormat(report.created_at.toString())}</p>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="overflow-y-scroll max-h-[600px] max-w-[1000px]">
                                <DialogHeader className="border-b border-gray-300">
                                    <DialogTitle>
                                        <p>
                                            Báo cáo tới{" "}
                                            <span className="font-bold">
                                                {report.is_lecture ? "bài học: " : "khoá học: "}
                                            </span>{" "}
                                            {title}
                                        </p>
                                    </DialogTitle>
                                    <DialogDescription>
                                        <div className="border-b border-gray-300">
                                            <p className="text-lg text-black">
                                                Ngày tạo: {convertDateFormat(report.created_at.toString())}
                                            </p>
                                            <p className="text-lg text-black">Tiêu đề: {report.title}</p>
                                            <p className="text-lg text-black mb-3">Nội dung:</p>
                                        </div>
                                        <div className="my-4 description-course text-black">
                                            <div
                                                className=""
                                                dangerouslySetInnerHTML={{ __html: report.content }}
                                            ></div>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            className="border rounded-sm border-black hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 py-1 px-3"
                                        >
                                            Đóng
                                        </button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                            <TooltipTrigger>
                                <div
                                    className={`${report.is_handle ? "block  text-blue-400" : hovered ? "block" : "hidden"} `}
                                    onClick={handleOnClick}
                                >
                                    <CheckCircleIcon className="w-8 h-8 hover:text-blue-400 transition-all duration-300" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{report.is_handle ? "Đã xem" : "Đánh giấu đã xem"} </p>
                            </TooltipContent>
                        </div>
                    </>
                </Tooltip>
            </TooltipProvider>
        </Dialog>
    );
};

export default ReportCard;
