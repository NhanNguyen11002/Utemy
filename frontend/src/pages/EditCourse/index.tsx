import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { sectionActions, courseActions, lectureActions } from "../../redux/slices";
import { useParams } from "react-router-dom";
import {
    DeleteModal,
    PopupAddLesson,
    PopupUpdateLesson,
    Spin,
    PopupChoseLectureType,
    PopupAddTest,
} from "../../components";
import AccordionSection from "../../components/Accordion/AccordionSection";
import { AddSection as AddSectionType, Section as SectionType } from "../../types/section";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import * as Tabs from "@radix-ui/react-tabs";
import toast from "react-hot-toast";
import EditForm from "./EditForm";
import TargetTab from "./TargetTab";
import PromotionTab from "./PromotionTab";
import StatusTab from "./StatusTab";
import NotFound from "../NotFound";
import constants from "../../constants";
import PopupUpdateTest from "../../components/Popup/PopupUpdateTest";

const EditCourse: React.FC = () => {
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [isDeleteSection, setIsDeleteSection] = useState<boolean>(false);
    const [isDisplayAddLessonModal, setIsDisplayAddLessonModal] = useState<boolean>(false);
    const [isDisplayAddTestModal, setIsDisplayAddTestModal] = useState<boolean>(false);
    const [isChangeType, setIsChangeType] = useState<boolean>(false);
    const [tab, setTab] = useState("form");
    //
    const [isDisplayAddLectureModal, setIsDisplayAddLectureModal] = useState<boolean>(false);
    const [isDisplayEditLectureModal, setIsDisplayEditLectureModal] = useState<boolean>(false);

    const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sections);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [section, setSection] = useState<string>("");
    const [errorSection, setErrorSection] = useState<boolean>(false);
    const [errorEditSection, setErrorEditSection] = useState<boolean>(false);
    const [sectionId, setSectionId] = useState<number>(-1);
    const [type, setType] = useState<string>("");
    const [itemTitle, setItemTitle] = useState<string>("");
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "";

    const { course_id } = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(courseActions.getCourseDetailById(Number(course_id))).then((response) => {
            if (response && response.payload && response.payload.data && response.payload?.status_code === 200) {
                dispatch(courseActions.getRightOfCourse(response.payload.data.course_id));
            } else {
                setIsNotFound(true);
            }
        });
        dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
    }, [dispatch, course_id]);

    const handleRerender = () => {
        dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
    };
    // add section
    const handleAddSection = () => {
        if (section !== "") {
            setErrorSection(false);
            const values: AddSectionType = {
                course_id: Number(course_id),
                title: section,
            };
            dispatch(sectionActions.addSection(values)).then((response) => {
                if (response.payload?.status_code === 201) {
                    toast.success(response.payload.message);
                    dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
                } else {
                    if (response.payload) toast.error(response.payload?.message);
                }
            });
            setSection("");
        } else {
            setErrorSection(true);
            setTimeout(() => {
                setErrorSection(false);
            }, 3000);
        }
    };
    // delete section, lecture
    const handleDisplayDeleteModal = (id: number, isDeleteSection: boolean) => {
        setSectionId(id);
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
        if (isDeleteSection) {
            setIsDeleteSection(true);
        } else {
            setIsDeleteSection(false);
        }
    };

    //lecture
    const handleDisplayAddLectureModal = (sectionId: number) => {
        setSectionId(sectionId);
        setIsChangeType(false);
        setIsDisplayAddLectureModal(!isDisplayAddLectureModal);
    };
    const handleCancelAddLectureModal = () => {
        setIsDisplayAddLectureModal(!isDisplayAddLectureModal);
    };
    const handleCancelModalEditLecture = () => {
        setIsDisplayEditLectureModal(!isDisplayEditLectureModal);
        dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
    };
    const handleChangeType = () => {
        setIsChangeType(true);
        setIsDisplayEditLectureModal(false);
        setIsDisplayAddLectureModal(true);
    };

    //delete modal
    const handleCancelModal = () => {
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };
    //lesson
    const handleToggleModalAddLesson = () => {
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };
    //test
    const handleToggleModalAddTest = () => {
        setIsDisplayAddTestModal(!isDisplayAddTestModal);
    };

    const handleDeleteSection = () => {
        dispatch(sectionActions.deleteSection(sectionId)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setDeleteSection(sectionId));
                dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleDeleteLecture = () => {
        dispatch(lectureActions.deleteLecture(sectionId)).then((response) => {
            if (response.payload?.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.getAllSectionByCourseId(course_id as string));
            } else {
                if (response.payload) toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        if (title === "") {
            setErrorEditSection(true);
            setTimeout(() => {
                setErrorEditSection(false);
            }, 3000);
        } else {
            setErrorEditSection(false);
            dispatch(sectionActions.editSection({ section_id: id, title })).then((response) => {
                if (response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                    dispatch(sectionActions.setEditSection({ section_id: id, title }));
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
            setIsDisplayEditModal(!isDisplayEditModal);
        }
    };
    //lecture
    const handleDisplayEditLecture = (lectureId: number, type: string) => {
        setSectionId(lectureId);
        setType(type);
        setIsDisplayEditLectureModal(!isDisplayEditLectureModal);
    };
    //section
    const handleDisplayEditModal = (id: number, title: string) => {
        setSectionId(id);
        setItemTitle(title);
        setIsDisplayEditModal(!isDisplayEditModal);
    };

    if (isNotFound) return <NotFound />;
    if (role !== constants.util.ROLE_AUTHOR) {
        if (!isGetLoading) return <NotFound />;
    }

    return (
        <>
            {isGetLoading !== true ? (
                <>
                    <div className=" h-full px-4 tablet:px-[60px]">
                        <a
                            href={`/lecturer`}
                            className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                            <p className="text-lg"> Quản lý khoá học của tôi</p>
                        </a>
                        <div className="w-[230px] h-px bg-gray-300"></div>
                        <Tabs.Root defaultValue="form" className="h-fit flex w-full">
                            <Tabs.List className="flex flex-col h-fit gap-2 w-[20%] mt-8">
                                <Tabs.Trigger
                                    value="form"
                                    onClick={() => setTab("form")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "form" ? "border-blue-400" : "border-white"}`}
                                >
                                    Tổng quan khoá học
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="target"
                                    onClick={() => setTab("target")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "target" ? "border-blue-400" : "border-white"}`}
                                >
                                    Học viên mục tiêu
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="section"
                                    onClick={() => setTab("section")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "section" ? "border-blue-400" : "border-white"}`}
                                >
                                    Chương trình giảng dạy
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="promotion"
                                    onClick={() => setTab("promotion")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "promotion" ? "border-blue-400" : "border-white"}`}
                                >
                                    Khuyến mại
                                </Tabs.Trigger>
                                <Tabs.Trigger
                                    value="status"
                                    onClick={() => setTab("status")}
                                    className={`text-start text-lg hover:text-blue-400 transition-all duration-400 border-l-4 p-2 ${tab === "status" ? "border-blue-400" : "border-white"}`}
                                >
                                    Tình trạng khoá học
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value="form" className="w-[80%]">
                                <EditForm course_id={Number(course_id)} />
                            </Tabs.Content>
                            <Tabs.Content value="target" className="w-[80%]">
                                <TargetTab />
                            </Tabs.Content>
                            <Tabs.Content value="section" className="w-[80%]">
                                <div className="flex-1 flex flex-col border border-gray shadow-md ">
                                    <div className="border-b border-gray">
                                        <p className="text-2xl font-normal p-6">Chương trình giảng dạy</p>
                                    </div>
                                    <div className="p-4">
                                        <p className="py-4">
                                            Hãy bắt đầu xây dựng khóa học của bạn bằng cách tạo các chương, bài giảng và
                                            bài kiểm tra. Hãy chắc chắn các nội dung được chau chuốt và tên các chương,
                                            bài giảng, bài kiểm tra phải cô đọng nội dung cho học viên
                                        </p>
                                        <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between">
                                            <input
                                                type="text"
                                                maxLength={100}
                                                className="px-2 py-2 rounded-lg border-[1px] outline-none flex-1 max-w-2xl"
                                                placeholder="Tên của chương học..."
                                                value={section}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setSection(e.target.value);
                                                }}
                                            />
                                            <div className=" flex flex-col-reverse tablet:flex-row items-center justify-center gap-2">
                                                <button
                                                    className="text-white btn btn-info text-lg flex-2 ml-2"
                                                    onClick={handleAddSection}
                                                >
                                                    Thêm chương học
                                                </button>
                                            </div>
                                        </div>
                                        {errorSection && (
                                            <p className={`text-error italic font-medium mt-1`}>
                                                Tên chương là bắt buộc
                                            </p>
                                        )}
                                        {/* handle list lesson */}
                                        <div className="mt-2">
                                            {sectionOfCourse.length <= 0 ? (
                                                <h1 className="text-center text-2xl text-error">
                                                    Khóa học chưa có chương học nào
                                                </h1>
                                            ) : (
                                                sectionOfCourse.map((section, index) => (
                                                    <AccordionSection
                                                        key={index}
                                                        section={section}
                                                        handleDeleteSection={handleDeleteSection}
                                                        handleDisplayEditModal={handleDisplayEditModal}
                                                        handleDisplayDeleteModal={handleDisplayDeleteModal}
                                                        handleDisplayAddLectureModal={handleDisplayAddLectureModal} // addlesson đây
                                                        handleDisplayEditLecture={handleDisplayEditLecture}
                                                        isDisplayEdit={true}
                                                        isDisplayProgress={false}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="promotion" className="w-[80%]">
                                <PromotionTab />
                            </Tabs.Content>
                            <Tabs.Content value="status" className="w-[80%]">
                                <StatusTab />
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                    {/* POPUP DELETE LECTURE AND SECTION*/}
                    {isDisplayDeleteModal && (
                        <DeleteModal
                            handleDelete={isDeleteSection ? handleDeleteSection : handleDeleteLecture}
                            handleCancel={handleCancelModal}
                        />
                    )}
                    {/* POPUP EDIT SECTION */}
                    {isDisplayEditModal && (
                        <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center shadow-lg">
                            <div className="bg-background p-4 w-[400px] flex flex-col items-center justify-center rounded-lg ">
                                <h1 className="text-3xl mb-1 text-lightblue font-bold text-center text-title">
                                    Sửa chương học
                                </h1>

                                <form className="flex flex-col gap-1 w-full">
                                    <div className="text-sm mb-1 tablet:text-xl font-medium">Tên chương</div>
                                    <input
                                        maxLength={100}
                                        type="text"
                                        value={itemTitle}
                                        className="px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg"
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </form>
                                {errorEditSection && (
                                    <p className={`text-error italic font-medium mt-1`}>Tên chương là bắt buộc</p>
                                )}
                                <div className="mt-2 flex justify-end w-full">
                                    <button
                                        className={`text-white btn btn-info hover:opacity-75 text-lg ${
                                            isLoading ? "disabled" : ""
                                        }`}
                                        onClick={() => handleEditSection(sectionId, itemTitle)}
                                    >
                                        {isLoading ? "Loading..." : "Lưu"}
                                    </button>
                                    <button
                                        className="btn text-lg ml-2"
                                        onClick={() => setIsDisplayEditModal(!isDisplayEditModal)}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* POPUP ADD LESSON */}
                    {isDisplayAddLessonModal && (
                        <PopupAddLesson
                            handleCancel={handleToggleModalAddLesson}
                            handleRerender={handleRerender}
                            handleCancelChangeType={() => setIsChangeType(false)}
                            sectionId={sectionId}
                            changeType={isChangeType}
                        />
                    )}
                    {/* POPUP ADD TEST */}
                    {isDisplayAddTestModal && (
                        <PopupAddTest
                            handleCancel={handleToggleModalAddTest}
                            handleRerender={handleRerender}
                            handleCancelChangeType={() => setIsChangeType(false)}
                            sectionId={sectionId}
                            changeType={isChangeType}
                        />
                    )}
                    {/* POPUP CHOSE LECTURE TYPE */}
                    {isDisplayAddLectureModal && (
                        <PopupChoseLectureType
                            handleCancel={handleCancelAddLectureModal}
                            handleOpenAddLesson={handleToggleModalAddLesson}
                            handleOpenAddTest={handleToggleModalAddTest}
                        />
                    )}
                    {/* POPUP EDIT LESSON */}
                    {isDisplayEditLectureModal ? (
                        type === "Lesson" ? (
                            <PopupUpdateLesson
                                handleRerender={handleRerender}
                                handleCancel={handleCancelModalEditLecture}
                                lectureId={sectionId}
                                handleChangeType={handleChangeType}
                            />
                        ) : (
                            <>
                                <PopupUpdateTest
                                    handleRerender={handleRerender}
                                    handleCancel={handleCancelModalEditLecture}
                                    lectureId={sectionId}
                                    handleChangeType={handleChangeType}
                                />
                            </>
                        )
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <Spin />
            )}
        </>
    );
};

export default EditCourse;
