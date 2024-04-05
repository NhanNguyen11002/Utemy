import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { Link } from "react-router-dom";
import { CheckBadgeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { courseActions } from "../../../redux/slices";

import toast from "react-hot-toast";

const ApprovalTab = () => {
    const slug = useAppSelector((state) => state.courseSlice.courseDetail.slug);
    const status = useAppSelector((state) => state.courseSlice.courseDetail.status);
    const course_id = useAppSelector((state) => state.courseSlice.courseDetail.course_id);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const dispatch = useAppDispatch();
    const handleClick = () => {
        if (status) {
            dispatch(courseActions.restrictCourse(Number(course_id))).then((response) => {
                if (response && response.payload && response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        } else {
            dispatch(courseActions.approveCourse(Number(course_id))).then((response) => {
                if (response && response.payload && response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        }
    };

    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Duyệt khoá học</p>
            </div>
            <div className="p-6 pr-24">
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
                    Đây sẽ là trang mà bạn sẽ quyết định phê duyệt khoá học để hiển thị lên và cho phép mua bán trên
                    khoá học, bạn cũng có thể hạn chế và ẩn những khoá học vi phạm chính sách cộng đồng và
                </p>
                <div className="mt-2 mb-4">
                    <p className=" font-bold">
                        Hãy đảm bảo xem xét kĩ càng nội dung giảng dạy của khoá học trước khi thực hiện quyết định
                    </p>
                    <Link to={`/admin/course-detail/${slug}`}>
                        <p className="text-blue-400 hover:underline hover:cursor-pointer">
                            Xem trước nội dung khoá học tại đây
                        </p>
                    </Link>
                </div>
                <div className="mt-2 mb-4">
                    <p className="font-bold">Duyệt/ẩn khoá học</p>
                    <p className="my-1">
                        Nếu bạn có ý định ẩn khoá học, hãy nhớ gửi cho giảng viên một quyết định trên khoá học của họ để
                        thông báo những lí do thoả đáng ở trang quyết định khoá học
                    </p>
                    <button
                        onClick={() => handleClick()}
                        disabled={isLoading}
                        type="button"
                        className={`disabled:bg-gray-300 rounded-sm transition-all duration-300 my-2 text-white text-lg ${status ? "bg-red-400 hover:bg-red-600 " : "bg-blue-400 hover:bg-blue-600 "} text-white p-4`}
                    >
                        {isLoading ? "Loadding" : status ? "Ẩn khoá học" : "Duyệt khoá học"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ApprovalTab;
