import React, { useEffect, useState } from "react";
import { FlagIcon } from "@heroicons/react/24/outline";
import { Course as CourseDetailType } from "../../types/course";
import { ThreedotIcon } from "../../assets/icons";
import { Formik, Field, ErrorMessage } from "formik";
import { TextEditorWithImage } from "..";
import { CreateReport as CreateReportType } from "../../types/report";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    // DialogFooter,
    DialogClose,
} from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { reportActions } from "../../redux/slices";
import toast from "react-hot-toast";
import { Lecture } from "../../types/lecture";

type UserToolDropdownProps = {
    courseDetail: CourseDetailType;
    isLecture: boolean;
    lecture?: Lecture;
};

const UserToolDropdown: React.FC<UserToolDropdownProps> = (props) => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.reportSlice.isLoading) || false;
    const [content, setContent] = useState("");
    const [reporting, setReporting] = useState(true);
    const initialValue: CreateReportType = {
        course_id: props.courseDetail.course_id,
        is_lecture: props.isLecture,
        lecture_id: props.lecture ? props.lecture.lecture_id : 0,
        content: "",
        title: "",
    };
    const handleOnSubmit = (values: any, formik: any) => {
        dispatch(reportActions.createReport(values)).then((res: any) => {
            if (res && res.payload) {
                if (res.payload.status_code === 200) {
                    toast.success(res.payload.message);
                    formik.resetForm(initialValue);
                    setContent("");
                    setReporting(false);
                } else {
                    toast.error(res.payload.message);
                }
            }
        });
    };
    const handleContentChange = (content: string, formik: any) => {
        console.log(content);
        formik.setFieldValue("content", content);
        setContent(content);
    };
    useEffect(() => {
        setReporting(true);
    }, [props.courseDetail.course_id]);
    return (
        <>
            <Dialog>
                <div className="dropdown dropdown-right ">
                    <div tabIndex={0} role="button" className="btn btn-xs btn-circle m-1 bg-inherit border-0 ">
                        <ThreedotIcon />
                    </div>

                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <DialogTrigger>
                                <span className="flex text-black text-xl items-center gap-2">
                                    <FlagIcon className="w-4 h-4" />
                                    <span>Báo xấu</span>
                                </span>
                            </DialogTrigger>
                        </li>
                    </ul>
                    <DialogContent className="min-w-[500px] min-h-[300px] flex flex-col items-start">
                        <DialogHeader>
                            <DialogTitle>Báo xấu {props.isLecture && "bài học của"} khoá học</DialogTitle>
                            <DialogDescription>
                                <div className="flex gap-2 items-start mt-2">
                                    <img src={props.courseDetail.thumbnail} alt="thumbnail" className="w-16 shrink-0" />
                                    <div className="flex flex-col">
                                        <p className="text-black title-card-content">{props.courseDetail.title}</p>
                                        {props.isLecture && (
                                            <p className="text-black title-card-content">
                                                Bài học: {props.lecture ? props.lecture.content.title : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        {reporting ? (
                            <div>
                                <Formik
                                    // validationSchema={addPromotionValidationSchema}
                                    initialValues={initialValue}
                                    onSubmit={handleOnSubmit}
                                    enableReinitialize={true}
                                >
                                    {(formik) => (
                                        <form
                                            onSubmit={formik.handleSubmit}
                                            className="text-sm mb-1 tablet:text-xl font-normal"
                                        >
                                            <div className="">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 tablet:text-lg font-normal"
                                                >
                                                    Tiêu đề
                                                </label>
                                                <p className="text-black text-sm">
                                                    Hãy nêu ngắn gọn lí do báo xấu được gửi đi tại đây
                                                </p>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className={`px-2 py-4 border-[1px] outline-none w-full rounded-lg text-base ${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>

                                            <div className="">
                                                <label
                                                    htmlFor="content"
                                                    className="text-sm mb-1 tablet:text-lg font-normal"
                                                >
                                                    Chi tiết nội dung
                                                </label>
                                                <br />
                                                <Field
                                                    placeholder=""
                                                    component={TextEditorWithImage}
                                                    handleChangeContent={(content: string) =>
                                                        handleContentChange(content, formik)
                                                    }
                                                    content={content}
                                                    type="text"
                                                    name="content"
                                                    className={` w-full px-2 py-2 rounded-lg border-[1px] outline-none ${
                                                        formik.errors.content &&
                                                        formik.touched.content &&
                                                        "border-error"
                                                    } `}
                                                />
                                                <br />
                                                <ErrorMessage
                                                    name="content"
                                                    component="span"
                                                    className="text-[14px] text-error font-normal"
                                                />
                                            </div>

                                            <div className="flex justify-end px-4 mt-4">
                                                <button
                                                    type="submit"
                                                    name="save_button"
                                                    className="py-3 px-4 bg-blue-400 hover:bg-blue-500 rounded-sm transition-all duration-300 ml-2 mt-10 text-white text-lg"
                                                >
                                                    {isLoading ? "Loading..." : "Gửi báo cáo"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </div>
                        ) : (
                            <div className="flex flex-col text-center">
                                <div>
                                    <p className="text-lg font-medium">
                                        {" "}
                                        Chúng tôi sẽ xem xét báo xấu của bạn và đưa ra quyết định phù hợp{" "}
                                    </p>
                                </div>
                                <p>
                                    Chúng tôi rất trân trọng nỗ lực của bạn trong việc giữ cho Utemy luôn luôn phù hợp
                                    với tiêu chuẩn cộng đồng
                                </p>
                            </div>
                        )}

                        {!reporting && (
                            <DialogClose className="self-end">
                                <button
                                    type="button"
                                    className="border rounded-sm border-black hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 py-1 px-3 self-end"
                                >
                                    Đóng
                                </button>
                            </DialogClose>
                        )}
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );
};

export default UserToolDropdown;
