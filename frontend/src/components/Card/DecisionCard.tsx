import { DecisionType } from "@/types/decision";
import { InformationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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
import { decisionActions } from "../../redux/slices";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
type DecisionCardProps = {
    decision: DecisionType;
    isAuthor: boolean;
};
const DecisionCard: React.FC<DecisionCardProps> = ({ decision, isAuthor }) => {
    const dispatch = useAppDispatch();
    const [hovered, setHovered] = useState(false);
    const handleOnClick = () => {
        dispatch(decisionActions.handleDecision(decision.decision_id)).then((res) => {
            if (res && res.payload) {
                if (res.payload.status_code === 200) {
                    console.log("ez");
                    toast.success(res.payload.message);
                    dispatch(decisionActions.setHandleDecision(decision.decision_id));
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
                            className={`border border-gray-300 p-4 flex items-center justify-between hover:cursor-pointer ${decision.is_handle && "opacity-60"}`}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            onClick={() => setHovered(false)}
                        >
                            <DialogTrigger className="w-[90%]">
                                <div className="flex items-center justify-start gap-3 text-start">
                                    {decision.type === "announced" ? (
                                        <InformationCircleIcon className="w-5 h-5 " />
                                    ) : (
                                        <ExclamationTriangleIcon className="w-5 h-5 fill-red-500" />
                                    )}
                                    <div>
                                        <div className="flex gap-2">
                                            <p>
                                                {decision.type === "announced"
                                                    ? "Thông báo dành cho khoá học"
                                                    : "Cảnh cáo dành cho khoá học"}
                                            </p>
                                            <p className={`${hovered ? "block" : "hidden"} hover:underline`}>
                                                Xem chi tiết
                                            </p>
                                        </div>
                                        <p>Ngày tạo: {convertDateFormat(decision.created_at.toString())}</p>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="overflow-y-scroll max-h-[600px] max-w-[1000px]">
                                <DialogHeader className="border-b border-gray-300">
                                    <DialogTitle>
                                        <p>
                                            {decision.type === "announced"
                                                ? "Thông báo dành cho khoá học"
                                                : "Cảnh cáo dành cho khoá học"}
                                        </p>
                                    </DialogTitle>
                                    <DialogDescription>
                                        <div className="border-b border-gray-300">
                                            <p className="text-lg text-black">
                                                Ngày tạo: {convertDateFormat(decision.created_at.toString())}
                                            </p>
                                            <p className="text-lg text-black mb-3">Nội dung:</p>
                                        </div>
                                        <div className="my-4 description-course text-black ql-snow">
                                            <div
                                                className="ql-editor"
                                                dangerouslySetInnerHTML={{ __html: decision.content }}
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
                                {(isAuthor || decision.is_handle) && (
                                    <button
                                        className={`${decision.is_handle ? "block  text-blue-400" : hovered ? "block" : "hidden"} `}
                                        disabled={decision.is_handle}
                                        onClick={handleOnClick}
                                    >
                                        <CheckCircleIcon className="w-8 h-8 hover:text-blue-400 transition-all duration-300" />
                                    </button>
                                )}
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{decision.is_handle ? "Đã giải quyết" : "Giải quyết"} </p>
                            </TooltipContent>
                        </div>
                    </>
                </Tooltip>
            </TooltipProvider>
        </Dialog>
    );
};

export default DecisionCard;
