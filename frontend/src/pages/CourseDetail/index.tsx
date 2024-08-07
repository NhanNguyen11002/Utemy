import React, { useEffect, useState } from "react";
import {
    DeleteModal,
    Spin,
    TotalRating,
    Pagination,
    UserToolDropdown,
    VideoPlayerForTrailerTrial,
} from "../../components";
import AccordionSection from "../../components/Accordion/AccordionSection";
// import AccordionSectionForTrial from "../../components/Accordion/AccordionSectionForTrial";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../types/section";
import { Course as CourseDetailType } from "../../types/course";
import { GetRating, Rating as RatingType } from "../../types/rating";
import { Link } from "react-router-dom";
import NotFound from "../NotFound";
import { courseActions, ratingActions, progressActions } from "../../redux/slices";
import PopupRating from "./PopupRating";
import toast from "react-hot-toast";
import AuthorButton from "./AuthorButton";
import GuestButton from "./GuestButton";
import SubscribeUserButton from "./SubscribeUserButton";
import CommentSection from "./CommentSection";
import constants from "../../constants";
import { calDayRemains, getCourseIncludes, convertStringDate } from "../../utils/helper";
// import { orderLesson } from "../../types/lesson";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import "react-quill/dist/quill.snow.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

import {
    CheckIcon,
    ClockIcon,
    PlayCircleIcon,
    BookOpenIcon,
    GlobeAsiaAustraliaIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    // DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";

type CourseDetailProps = {
    isLogin: boolean;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ isLogin }) => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenPopupRating, setIsOpenPopupRating] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const navigate = useNavigate();
    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};
    const courseDetailForTrial: CourseDetailType =
        useAppSelector((state) => state.courseSlice.courseDetailForTrial) ?? {};
    const ratings: RatingType[] = useAppSelector((state) => state.ratingSlice.ratings) ?? [];
    const totalRatingPage: number = useAppSelector((state) => state.ratingSlice.totalPage) ?? Number(1);
    const totalRatingRecord: number = useAppSelector((state) => state.ratingSlice.totalRecord) ?? Number(0);

    const { duration, lessonCount } = getCourseIncludes(courseDetail);
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "Unenrolled";
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin) ?? false;
    const isGetLoadingCourse: boolean = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const ratingPercent = useAppSelector((state) => state.ratingSlice.ratingPercent) ?? [];
    const hasSalePrice =
        courseDetail.sale_price &&
        courseDetail.price &&
        courseDetail.sale_price < courseDetail.price &&
        courseDetail.sale_until &&
        new Date(courseDetail.sale_until) > new Date();

    let dayRemains = undefined;
    if (hasSalePrice) dayRemains = calDayRemains(courseDetail.sale_until as string);

    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < Number(1)) {
            setPageIndex(totalRatingPage);
        } else if (pageIndex > totalRatingPage) setPageIndex(Number(1));
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleDeleteCourse = () => {
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/my-courses");
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
    const handleTogglePopupRating = () => {
        setIsOpenPopupRating(!isOpenPopupRating);
    };

    const handleAfterVote = () => {
        dispatch(courseActions.getCourseDetail(slug as string));
        const values: GetRating = {
            slug: slug as string,
            page_index: pageIndex,
            score: 0,
        };
        dispatch(ratingActions.getListRatingOfCourseBySlug(values));
        dispatch(ratingActions.getRatingPercentOfCourse(slug as string));
    };

    // const [videoDialog, setVideoDialog] = useState<React.ReactNode | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [descriptionVideo, setDescriptionVideo] = useState("");

    const handleShowVideoDialog = (urlVideo: string, descriptionVideo: string) => {
        setVideoUrl(urlVideo);
        setDescriptionVideo(descriptionVideo);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    useEffect(() => {
        dispatch(courseActions.getCourseDetail(slug as string)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);
    useEffect(() => {
        dispatch(courseActions.getCourseDetailForTrialLesson(slug as string)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);
    useEffect(() => {
        if (courseDetail.course_id && isLogin) {
            dispatch(courseActions.getRightOfCourse(courseDetail.course_id)).then((res) => {
                if (res.payload && res.payload.data) {
                    if (res.payload.data.role === constants.util.ROLE_ENROLLED) {
                        dispatch(progressActions.getProgressByCourseSlug(slug as string));
                    }
                }
            });
            dispatch(ratingActions.getUserRating(courseDetail.course_id));
        }
    }, [dispatch, courseDetail.course_id, isLogin]);
    useEffect(() => {
        if (courseDetail.number_of_rating > 0) {
            const values: GetRating = {
                slug: slug as string,
                page_index: pageIndex,
                score: 0,
            };
            dispatch(ratingActions.getListRatingOfCourseBySlug(values));
            dispatch(ratingActions.getRatingPercentOfCourse(slug as string));
        }
    }, [dispatch, courseDetail, pageIndex]);
    const handleFilterRatings = (scoreFilter: number) => {
        if (courseDetail.number_of_rating > 0) {
            // setPageIndex(1);
            const values: GetRating = {
                slug: slug as string,
                page_index: 1,
                score: scoreFilter,
            };
            dispatch(ratingActions.getListRatingOfCourseBySlug(values));
        }
    };
    // const [openDialog, ] = useState(false);

    // const handleOpenDialog = () => {
    //     setOpenDialog(true);
    // };

    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // };
    const [isHovered, setIsHovered] = useState(false);

    if (isNotFound) return <NotFound />;
    // Hàm tiện ích để lấy các bài giảng chung
    function getCommonLectures(apiData1: any, apiData2: any) {
        const lectures1 = apiData1.sections.flatMap((section: any) => section.lecture);
        const lectures2 = apiData2.sections.flatMap((section: any) => section.lecture);

        const lectureMap = new Map();
        lectures1.forEach((lecture: any) => {
            lectureMap.set(lecture.lecture_id, lecture);
        });

        const commonLectures = lectures2.filter((lecture: any) => lectureMap.has(lecture.lecture_id));

        return commonLectures;
    }
    const commonLectures = getCommonLectures(courseDetail, courseDetailForTrial);
    return (
        <>
            {isOpenPopupRating && (
                <PopupRating
                    handleAfterVote={handleAfterVote}
                    handleCancel={handleTogglePopupRating}
                    course_id={courseDetail.course_id}
                />
            )}
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}

            {isGetLoadingCourse && <Spin />}
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                {role === constants.util.ROLE_AUTHOR && (
                    <>
                        <a
                            href={`/lecturer/course/edit/${courseDetail.course_id}`}
                            className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <p className="text-lg"> Quay lại chỉnh sửa</p>
                        </a>
                        <div className="w-[230px] h-px bg-gray-300"></div>
                    </>
                )}
                {isAdmin && (
                    <Link to={`/admin/course/${slug}`}>
                        <div className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <p className="text-lg"> Quay lại quản lý</p>
                        </div>
                    </Link>
                )}
                <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                    <div className="mt-4 container mx-auto p-4">
                        <div className="flex flex-col gap-4 laptop:flex-row items-center rounded-lg ">
                            <div className="flex justify-center items-center w-full h-full">
                                <div className=" flex-1 w-full laptop:max-w-[600px] max-h-[400px] bg-gray-600 rounded-lg relative">
                                    <div className="overflow-hidden">
                                        <img
                                            src={courseDetail.thumbnail}
                                            alt="Thumbnail"
                                            className={`h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-contain transition-transform ${isHovered ? "scale-110" : ""}`}
                                            // style={{maxHeight: "380px", marginTop: "10px" }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        />
                                    </div>

                                    <Dialog>
                                        <DialogTrigger>
                                            <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
                                                <PlayCircleIcon
                                                    className={`text-white w-28 h-28 transition-transform ${
                                                        isHovered ? "" : "scale-110"
                                                    }`}
                                                    onMouseEnter={() => setIsHovered(true)}
                                                    onMouseLeave={() => setIsHovered(false)}
                                                />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
                                            <DialogTitle className={"text-center"}>
                                                Đây là đoạn video giới thiệu cho khóa học này
                                            </DialogTitle>
                                            <VideoPlayerForTrailerTrial source={courseDetail.url_trailer} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-3 pb-3 self-start laptop:self-center laptop:pt-3">
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h2 className="text-xl laptop:text-2xl font-bold text-title mb-3 tablet:w-[300px] xl:w-[600px] line-clamp-4 ">
                                            {courseDetail.title}
                                        </h2>
                                        {isLogin && !isAdmin && role !== constants.util.ROLE_AUTHOR && (
                                            <UserToolDropdown courseDetail={courseDetail} isLecture={false} />
                                        )}
                                    </div>
                                    <div className="summary-card-content mb-3">
                                        <p className="text-lg italic line-clamp-5 font-normal ">
                                            {courseDetail.summary}
                                        </p>
                                    </div>

                                    <div className="flex items-center l font-normal mb-3">
                                        <p className="font-bold text-xl ml-2  text-[#EAB308]">
                                            {courseDetail.average_rating}
                                        </p>
                                        <TotalRating
                                            ratingId={0}
                                            totalScore={Number(courseDetail.average_rating)}
                                            isForCourse={true}
                                        />
                                        <a
                                            href="#Rating"
                                            className="text-m  ml-2 hover:cursor-pointer hover:text-blue-700 text-blue-500 transition-all duration-300"
                                            onClick={() => {
                                                const button = document.getElementById("Rating");
                                                button?.click();
                                            }}
                                        >
                                            ({courseDetail.number_of_rating} xếp hạng)
                                        </a>
                                        <p className="text-m  ml-2 ">{courseDetail.number_of_enrolled} học viên</p>
                                    </div>
                                    <div className="flex items-center text-xl font-medium mb-3">
                                        <span className="text-base font-bold mr-2">Cập nhật gần đây:</span>
                                        <p className="text-base  ml-2 ">
                                            {courseDetail.updated_at
                                                ? convertStringDate(courseDetail.updated_at.toString())
                                                : convertStringDate(new Date().toString())}
                                        </p>
                                    </div>
                                    {hasSalePrice ? (
                                        <div className="text-xl font-bold laptop:text-l mb-3">
                                            Giá:
                                            <span className=" font-extrabold font-OpenSans text-blue-500 ">
                                                {" "}
                                                {courseDetail.sale_price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                            <span className="font-normal italic text-sm line-through ">
                                                {" "}
                                                {courseDetail.price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                            <span className=" font-extrabold font-OpenSans ml-2 text-blue-500 ">
                                                {" "}
                                                Trong vòng {dayRemains}
                                            </span>{" "}
                                        </div>
                                    ) : (
                                        <div className="text-xl font-bold laptop:text-l mb-3">
                                            Giá:
                                            <span className="font-extrabold font-OpenSans">
                                                {" "}
                                                {courseDetail.price?.toLocaleString()}đ{" "}
                                            </span>{" "}
                                        </div>
                                    )}
                                    <div className=" mb-3 text-xl laptop:text-base font-n">
                                        <span className="">Được tạo bởi </span>
                                        <Link
                                            to={
                                                role === constants.util.ROLE_AUTHOR
                                                    ? "/my-profile"
                                                    : `/profile/${courseDetail.author?.user_id}`
                                            }
                                            className=" text-blue-500 hover:text-blue-700 transition-all duration-300"
                                        >
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end gap-2 flex-wrap">
                                    {isLogin && (role === constants.util.ROLE_AUTHOR || isAdmin) && (
                                        <AuthorButton
                                            handleDelete={() => {
                                                setIsOpenDeleteModal(!isOpenDeleteModal);
                                                setIdItem(courseDetail.course_id as number);
                                            }}
                                            courseDetail={courseDetail}
                                        />
                                    )}
                                    {isLogin && role === constants.util.ROLE_ENROLLED && (
                                        <SubscribeUserButton courseDetail={courseDetail} />
                                    )}
                                    {(!isLogin || role === constants.util.ROLE_USER) && !isAdmin && (
                                        <GuestButton isLogin={isLogin} course_id={courseDetail.course_id} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <Tabs defaultValue={"Description"}>
                                <TabsList className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 w-1/2 justify-start ">
                                    <TabsTrigger
                                        key={"Description"}
                                        value={"Description"}
                                        className="data-[state=active]:border-b data-[state=active]:border-black rounded-[0px]"
                                    >
                                        Nội dung khóa học
                                    </TabsTrigger>
                                    <TabsTrigger
                                        key={"Study"}
                                        value={"Study"}
                                        className="data-[state=active]:border-b data-[state=active]:border-black rounded-[0px]"
                                    >
                                        Chuẩn đầu ra
                                    </TabsTrigger>

                                    <TabsTrigger
                                        id="Rating"
                                        key={"Rating"}
                                        value={"Rating"}
                                        className="data-[state=active]:border-b data-[state=active]:border-black rounded-[0px]"
                                    >
                                        Đánh giá
                                    </TabsTrigger>
                                </TabsList>
                                <div className="h-px w-full bg-gray-300"></div>

                                <TabsContent key="Study" value="Study">
                                    <div className="w-1/2">
                                        {courseDetail.study &&
                                            courseDetail.study.length > 0 &&
                                            courseDetail.study.map((study: any, index: any) => {
                                                return (
                                                    <div key={index} className="flex gap-1 items-start shrink-0">
                                                        <CheckIcon className="w-6 h-6 shrink-0" />
                                                        <p className="text-xl">{study}</p>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </TabsContent>
                                <TabsContent key="Description" value="Description">
                                    <div className="w-full flex flex-col laptop:flex-row gap-10">
                                        <div className="max-w-full laptop:w-1/2">
                                            <div className="my-4">
                                                <h2 className=" tablet:text-2xl font-bold mb-3">Yêu cầu</h2>
                                                <ul className="list-disc">
                                                    {courseDetail.requirement &&
                                                        courseDetail.requirement.length > 0 &&
                                                        courseDetail.requirement.map((req: any, index: any) => {
                                                            return (
                                                                <li key={index} className="ml-5">
                                                                    {req}
                                                                </li>
                                                            );
                                                        })}
                                                </ul>
                                            </div>
                                            <div className="my-4 description-course ql-snow">
                                                <h2 className=" tablet:text-2xl font-bold mb-3">Mô tả</h2>
                                                <div
                                                    className="ql-editor"
                                                    dangerouslySetInnerHTML={{ __html: courseDetail.description }}
                                                ></div>
                                            </div>
                                            <div className="table-of-content my-4">
                                                <h2 className="text-xl tablet:text-2xl font-bold mb-3">
                                                    Nội dung khóa học
                                                </h2>
                                                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                                {!courseDetail.sections ||
                                                    (courseDetail.sections.length === 0 && (
                                                        <p className="mt-4 text-xl text-center text-lightblue font-bold">
                                                            Khóa học này chưa có nội dung gì
                                                        </p>
                                                    ))}
                                                {courseDetail.sections?.map((section: Section, index: number) => {
                                                    return (
                                                        <div key={index}>
                                                            <AccordionSection
                                                                key={section.id * index}
                                                                isDisplayEdit={false}
                                                                isDisplayProgress={
                                                                    role === constants.util.ROLE_ENROLLED
                                                                }
                                                                section={section}
                                                                redirectToWatchVideo={
                                                                    isLogin && !(role === constants.util.ROLE_USER)
                                                                }
                                                                handleShowVideoDialog={handleShowVideoDialog}
                                                                commonLectures={commonLectures}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                {showDialog && (
                                                    <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
                                                        <DialogContent
                                                            className={
                                                                "lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                                                            }
                                                        >
                                                            <DialogTitle className="text-center">
                                                                {descriptionVideo.replace(/<[^>]+>/g, "")}
                                                            </DialogTitle>
                                                            <VideoPlayerForTrailerTrial source={videoUrl} />
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </div>
                                        </div>
                                        <div className="max-w-full laptop:w-1/2 ">
                                            <div className="w-3/4 bg-white shadow-md rounded-md border-gray-400  items-center flex flex-col">
                                                <p className="text-lg ">Khóa học bao gồm</p>
                                                <table className="table">
                                                    <tbody>
                                                        <tr className="flex justify-between shrink-0">
                                                            <td className="flex gap-1 items-center">
                                                                <ClockIcon className="w-4 h-4" />
                                                                Giờ học video
                                                            </td>
                                                            <td>{duration}</td>
                                                        </tr>
                                                        <tr className="flex justify-between shrink-0">
                                                            <td className="flex gap-1 items-center">
                                                                <PlayCircleIcon className="w-4 h-4" />
                                                                Số bài học
                                                            </td>
                                                            <td>{lessonCount}</td>
                                                        </tr>
                                                        <tr className="flex justify-between shrink-0">
                                                            <td className="flex gap-1 items-center">
                                                                <BookOpenIcon className="w-4 h-4" />
                                                                Số chương
                                                            </td>
                                                            <td>{courseDetail.number_of_section}</td>
                                                        </tr>
                                                        <tr className="flex justify-between shrink-0">
                                                            <td className="flex gap-1 items-center">
                                                                <GlobeAsiaAustraliaIcon className="w-4 h-4" />
                                                                Ngôn ngữ
                                                            </td>
                                                            <td>Việt Nam</td>
                                                        </tr>
                                                        <tr className="flex justify-between shrink-0">
                                                            <td className="flex gap-1 items-center">
                                                                <TicketIcon className="w-4 h-4" />
                                                                Quyền truy cập vĩnh viễn trọn đời
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent key="Rating" value="Rating">
                                    <div id="#Rating">
                                        {isGetLoadingCourse ? (
                                            <p className="mt-4 text-2x text-center font-bold">Loading</p>
                                        ) : (
                                            <CommentSection
                                                ratingPercent={ratingPercent}
                                                averageRating={courseDetail.average_rating}
                                                ratings={ratings}
                                                handleFilterRatings={handleFilterRatings}
                                                handleTogglePopupRating={handleTogglePopupRating}
                                                role={role}
                                                isLogin={isLogin}
                                            />
                                        )}
                                        {totalRatingPage > 1 ? (
                                            <div className="flex justify-end my-4">
                                                <Pagination
                                                    handleChangePageIndex={handleChangePageIndex}
                                                    totalPage={totalRatingPage}
                                                    currentPage={pageIndex}
                                                />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {ratings.length === 0 && (
                                            <p className="mt-4 text-2xl text-error text-center font-bold">
                                                {totalRatingRecord === 0
                                                    ? "Khóa học này chưa có đánh giá"
                                                    : "Không có đánh giá theo tiêu chí lọc"}
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
