import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { WatchVideoIcon } from "../../assets/icons";
import { GraduationCapIcon } from "lucide-react";
import { Course as CourseDetail } from "../../types/course";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
type SubscribeUserButtonProps = {
    courseDetail: CourseDetail;
};

const SubscribeUserButton: React.FC<SubscribeUserButtonProps> = (props) => {
    const dispatch = useAppDispatch();
    const courseId = props.courseDetail.course_id;
    const myEnrolled = useAppSelector((state) => state.courseSlice.myEnrolled[courseId]);
    const isPass = myEnrolled ? myEnrolled.is_pass : false;
    const currentCertificate = useAppSelector((state) => state.courseSlice.currentCertificate);
    useEffect(() => {
        // dispatch get certificate public id
        if (isPass) dispatch(courseActions.getCertificate(courseId));
    }, [dispatch, isPass, courseId]);

    const handleViewCertificate = () => {
        console.log(currentCertificate);
        window.open("https://credsverse.com/credentials/" + currentCertificate, "_blank");
    };
    return (
        <>
            {props.courseDetail.number_of_section > 0 && (
                <div className="flex gap-2 items-center">
                    <button className=" btn btn-sm btn-info ">
                        <WatchVideoIcon />
                        <Link to={`/course-detail/${props.courseDetail.slug}/watch`}>
                            <span className="text-white">Chuyển đến khóa học</span>
                        </Link>
                    </button>
                    {isPass && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <button type="button" className=" btn btn-sm bg-green-400 text-white  ">
                                    <GraduationCapIcon className="w-5 h-5" />
                                    <span className="text-white">Chứng chỉ</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Chứng chỉ</DialogTitle>
                                    <DialogDescription>
                                        Bạn đã hoàn thành khoá học này. Đã có một bản chứng chỉ gửi về email của bạn khi
                                        bạn hoàn thành khoá học. Bạn cũng có thể nhấn vào nút dưới để chuyển sang trang
                                        chứng chỉ
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <button
                                        onClick={() => handleViewCertificate()}
                                        type="button"
                                        className="btn btn-sm bg-black text-white hover:text-black"
                                    >
                                        Xem chứng chỉ
                                    </button>
                                </div>
                                <DialogFooter className="text-gray-400 text-sm">Chứng chỉ</DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}
        </>
    );
};

export default SubscribeUserButton;
