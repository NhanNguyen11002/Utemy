import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { Course } from "../../types/course";
import { useState } from "react";
import Requirement from "./Requirement";
import Study from "./Study";
import { courseActions } from "../../redux/slices";
import { toast } from "react-hot-toast";

type TargetTabProps = {};

const TargetTab: React.FC<TargetTabProps> = () => {
    const courseDetail: Course = useAppSelector((state) => state.courseSlice.courseDetail);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const [study, setStudy] = useState(courseDetail.study || []);
    const [requirement, setRequirement] = useState(courseDetail.requirement || []);
    const [edit, setEdit] = useState(false);
    const dispatch = useAppDispatch();

    const handleSubmitStudy = (study: any) => {
        setStudy(study);
    };
    const handleSubmitRequirement = (requirement: any) => {
        setRequirement(requirement);
    };
    const handleClickButton = () => {
        const data = {
            course_id: courseDetail.course_id,
            study,
            requirement,
        };
        dispatch(courseActions.updateTargetCourse(data)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(courseActions.setStudyAndRequirement({ study, requirement }));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
    };

    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Học viên mục tiêu</p>
            </div>
            <div className="p-6 pr-24">
                <p>
                    Các mô tả sau sẽ hiển thị công khai trên trang Tổng quan khoá học và sẽ tác động trực tiếp đến thành
                    tích khoá học, đồng thời giúp học viên quyết định mức độ phù hợp của khoá học với họ hay không
                </p>
                <p className="font-bold">Học viên sẽ học được gì trong khoá học của bạn?</p>
                <p>
                    Bạn nên nhập một số kết quả mà học viên theo học khoá học của bạn sẽ đạt được để tạo được 1 đối
                    tượng học viên phù hợp
                </p>
                <div>
                    <Study study={study} handleSubmit={handleSubmitStudy} setEdit={setEdit} />
                </div>
                <p className="font-bold">Yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn là gì?</p>
                <p>
                    Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị mà học viên bắt buộc phải có trước khi tham
                    gia khóa học.
                </p>
                <p>
                    Nếu bạn không có yêu cầu nào, hãy tận dụng phần này và coi đây là cơ hội để bạn hạ thấp tiêu chuẩn
                    cho người mới bắt đầu.
                </p>
                <div>
                    <Requirement requirement={requirement} handleSubmit={handleSubmitRequirement} setEdit={setEdit} />
                </div>
                <button
                    type="button"
                    onClick={handleClickButton}
                    className={`bg-blue-400 hover:bg-blue-500 p-3 text-white text-lg font-medium disabled:bg-gray-300 mt-2`}
                    disabled={edit || isLoading}
                >
                    {isLoading ? "Loading..." : "Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
};

export default TargetTab;
