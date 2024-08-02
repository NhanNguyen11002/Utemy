import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
// import { ScrollArea } from "../../components/ui/scroll-area";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { DeleteModal, DecisionCard } from "../../components";
import { useEffect, useState } from "react";
import { approvalActions, courseActions, decisionActions } from "../../redux/slices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
type StatusTabProps = {};

const StatusTab: React.FC<StatusTabProps> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const course_id = useAppSelector((state) => state.courseSlice.courseDetail.course_id);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const status = useAppSelector((state) => state.courseSlice.courseDetail.status);
    const approval = useAppSelector((state) => state.courseSlice.courseDetail.approval) || [];
    const decision = useAppSelector((state) => state.decisionSlice.decisions) || [];
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const handleDeleteCourse = () => {
        dispatch(courseActions.deleteCourse(course_id)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/lecturer");
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };
    const handleClickApproval = () => {
        dispatch(approvalActions.createApproval(course_id)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    if (response.payload.data) {
                        const data = response.payload.data as any;

                        dispatch(courseActions.setApprovalCourseDetail({ ...data, approval_id: data.id }));
                    }
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
    };
    useEffect(() => {
        dispatch(decisionActions.getDecisionsByCourseId(course_id));
    }, [course_id]);

    return (
        <div className="w-full border min-h-[600px] shadow-md">
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Tình trạng khoá học</p>
            </div>
            <div className="p-6 pr-24 border-b border-gray">
                <div className="flex gap-1 text-lg my-2">
                    <p className="font-bold">Trạng thái hiện tại: </p>
                    {status ? (
                        <span className="font-normal flex gap-1 items-center">
                            Đã được duyệt <CheckBadgeIcon className="w-5 h-5 fill-green-400" strokeWidth={2} />
                        </span>
                    ) : (
                        <span className="font-normal flex gap-1 items-center">
                            Bị hạn chế <LockClosedIcon className="w-5 h-5 fill-red-400" strokeWidth={2} />
                        </span>
                    )}
                </div>
                <p className="mt-2 mb-4">
                    Đây sẽ là trang mà bạn có thể dùng để gửi các yêu cầu xét duyệt khoá học tới người quản trị, cũng
                    như theo dõi tình trạng khoá học hiện tại theo quyết định của người quản trị
                </p>
                <div className="mt-2 mb-4">
                    <p className="font-bold">Gửi yêu cầu xét duyệt khoá học</p>
                    <p className="my-1">
                        Sau khi chuẩn bị nội dung khoá học kĩ càng, bạn có thể gửi yêu cầu được phê duyệt và hiển thị
                        khoá học ở đây
                    </p>
                    <button
                        type="button"
                        onClick={() => handleClickApproval()}
                        disabled={status || approval.length !== 0}
                        className="p-4 py-3 px-4 bg-blue-400 hover:bg-blue-500 rounded-sm transition-all duration-300 my-2 text-white text-lg disabled:bg-gray-400"
                    >
                        {status
                            ? "Đã được duyệt"
                            : approval.length === 0
                              ? "Gửi yêu cầu xét duyệt khoá học"
                              : "Đang chờ xét duyệt"}{" "}
                    </button>
                </div>
                <div className="mt-2 mb-4">
                    <p className="font-bold mb-2">Các quyết định trên khoá học của bạn</p>
                    <div className=" min-h-[100px] h-fit max-h-[400px] w-[full] rounded-md border p-4 grid grid-cols-2 gap-3 overflow-y-scroll ">
                        {decision.length > 0 ? (
                            decision.map((decision, index) => {
                                return <DecisionCard key={index} decision={decision} isAuthor={true} />;
                            })
                        ) : (
                            <p>Không có quyết định nào trên khoá học của bạn</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="text-2xl font-normal">Xoá khoá học</p>
                <p className="font-normal">
                    Bạn có thể xoá khoá học tại đây.{" "}
                    <span className="text-red-600">Lưu ý đây là hành động không thể hoàn tác</span>
                </p>
                <button
                    type="button"
                    onClick={() => setIsOpenDeleteModal(true)}
                    className="p-4 py-3 px-4 bg-red-400 hover:bg-red-500 rounded-sm transition-all duration-300 my-2 text-white text-lg"
                >
                    {isLoading || isGetLoading ? "Loading" : "Xoá khoá học"}{" "}
                </button>
            </div>
        </div>
    );
};

export default StatusTab;
