import { Formik, Field, ErrorMessage } from "formik";
import { CreateDecision as CreateDecisionType } from "../../../types/decision";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { decisionActions } from "../../../redux/slices";
import { TextEditorWithImage, DecisionCard } from "../../../components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const DecisionTab = () => {
    const dispatch = useAppDispatch();

    const isLoading = useAppSelector((state) => state.decisionSlice.isLoading) || false;
    const isGetLoading = useAppSelector((state) => state.decisionSlice.isGetLoading) || false;
    const decisions = useAppSelector((state) => state.decisionSlice.decisions) || [];
    const courseId = useAppSelector((state) => state.courseSlice.courseDetail.course_id);
    const [selectedOption, setSelectedOption] = useState("announced");
    const [content, setContent] = useState("");
    const initialValue: CreateDecisionType = {
        course_id: courseId,
        content: "",
        type: "announced",
    };
    const handleContentChange = (content: string, formik: any) => {
        formik.setFieldValue("content", content);
        setContent(content);
    };
    const handleChooseType = (type: string, formik: any) => {
        formik.setFieldValue("type", type);
        setSelectedOption(type);
    };
    const handleOnSubmit = (values: any, formik: any) => {
        dispatch(decisionActions.createDecision(values)).then((res) => {
            if (res && res.payload) {
                if (res.payload.status_code === 200) {
                    toast.success(res.payload.message);
                    formik.resetForm(initialValue);
                    setSelectedOption("announced");
                    setContent("");
                    dispatch(decisionActions.getDecisionsByCourseId(courseId));
                } else {
                    toast.error(res.payload.message);
                }
            }
        });
    };
    useEffect(() => {
        dispatch(decisionActions.getDecisionsByCourseId(courseId));
    }, [dispatch]);
    return (
        <div className="w-full border min-h-[600px] shadow-md">
            <div className="border-b border-gray">
                <p className="text-2xl font-normal p-6">Quyết định khoá học</p>
            </div>
            <div className="p-6 pr-24 border-b border-gray">
                <p className="mt-2 mb-4">
                    Đây sẽ là trang mà bạn có thể dùng để gửi các quyết định trên khoá học này tới giảng viên sở hữu
                    khoá học, quyết định có thể là thông báo hoặc là hạn chế để thể hiện mức độ nghiêm trọng của quyết
                    định lên khoá học
                </p>
                <div className="mt-2 mb-4 ">
                    <p className="font-bold">Gửi quyết định trên khoá học</p>
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
                                    <div className="px-5 py-3">
                                        <label htmlFor="content" className="text-sm mb-1 tablet:text-lg font-normal">
                                            Loại quyết định
                                        </label>
                                        <br />
                                        <div className="flex gap-2">
                                            <div className="  flex gap-1 py-2 pr-2 items-center">
                                                <span className="label-text">Thông báo </span>
                                                <input
                                                    type="radio"
                                                    name="radio-type"
                                                    value="announced"
                                                    className="radio  checked:bg-blue-500"
                                                    checked={selectedOption === "announced"}
                                                    onChange={(event) => {
                                                        handleChooseType(event.target.value, formik);
                                                    }}
                                                />
                                            </div>
                                            <div className="  cursor-pointer flex gap-1 p-2 items-center">
                                                <span className="label-text">Cảnh cáo </span>
                                                <input
                                                    type="radio"
                                                    name="radio-type"
                                                    value="restricted"
                                                    className="radio  checked:bg-red-500"
                                                    checked={selectedOption === "restricted"}
                                                    onChange={(event) => {
                                                        handleChooseType(event.target.value, formik);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-3">
                                        <label htmlFor="content" className="text-sm mb-1 tablet:text-xl font-normal">
                                            Nội dung quyết định
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
                                                formik.errors.content && formik.touched.content && "border-error"
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
                                            className="py-3 px-4 bg-blue-400 hover:bg-blue-500 rounded-sm transition-all duration-300 ml-2 text-white text-lg"
                                        >
                                            {isLoading ? "Loading..." : "Gửi quyết định"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <div className="p-6 pr-24 ">
                <p className="font-bold mb-2">Các quyết định trên khoá học này</p>
                <div className="grid grid-cols-2 gap-2">
                    {isGetLoading && <p>Loading...</p>}
                    {decisions.length > 0 ? (
                        decisions.map((decision: any) => {
                            return <DecisionCard decision={decision} isAuthor={false} />;
                        })
                    ) : (
                        <p>Không có quyết định nào trên khoá học</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default DecisionTab;
