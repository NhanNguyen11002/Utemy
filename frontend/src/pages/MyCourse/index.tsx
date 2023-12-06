import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import CreateIcon from "../../assets/icons/CreateIcon";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import { Course } from "../../types/course";
import { Spin, Navbar, Pagination, CourseCard, DeleteModal } from "../../components";
import { User } from "../../types/user";
import toast from "react-hot-toast";

const MyCourses: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;
    let totalRecord: number = useAppSelector((state) => state.courseSlice.totalRecord) ?? 0;

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        dispatch(courseActions.getMyCourses({ pageIndex, keyword }));
    }, [dispatch, keyword, pageIndex]);

    // handle pagination
    const handleChangePageIndex = (pageIndex: number) => {
        console.log(pageIndex);
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        // return;
    };

    // handle search input
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setKeyword(userInput);
    };

    const handleEditCourse = (id: number) => {
        navigate(`/my-courses/edit/${id}`);
    };

    const handleDeleteCourse = () => {
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload?.status_code === 200) {
                dispatch(courseActions.getMyCourses({ pageIndex, keyword }));
                toast.success(response.payload.message);
            } else {
                toast.error(response.payload?.message as string);
            }
        });
        setIsOpenDeleteModal(false);
    };

    const handleCancelDeleteModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleDisplayDeleteModal = (courseId: number) => {
        setIdItem(courseId);
        setIsOpenDeleteModal(true);
    };

    return (
        <>
            {isGetLoading && <Spin />}
            <Navbar />

            {isOpenDeleteModal && (
                <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelDeleteModal} />
            )}
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-lightblue text-title">
                        Khóa học của tôi
                    </h1>
                    <div className="w-full flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Điền từ khóa ở đây..."
                                    className="rounded-full py-4 px-10 w-full tablet:w-[70%] border-[1px] border-black"
                                    value={userInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleKeyWordSearch();
                                    }}
                                />
                                <div className="cursor-pointer" onClick={handleKeyWordSearch}>
                                    <SearchIcon />
                                </div>
                            </div>
                        </div>
                        <Link to={"/create-course"}>
                            <div className="text-white flex-3 flex btn hover:opacity-80 btn-info text-lg">
                                <CreateIcon />
                                Tạo khóa học mới
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-1">
                        {courseList.map((course, index) => {
                            return (
                                <div className="w-full max-w-xs tablet:max-w-full place-self-center" key={index}>
                                    <CourseCard
                                        id={course.course_id}
                                        thumbnail={course.thumbnail}
                                        status={course.status}
                                        slug={course.slug}
                                        title={course.title}
                                        summary={course.summary}
                                        price={course.price}
                                        rating={course.average_rating}
                                        author={course.author as User}
                                        attendees={course.number_of_enrolled}
                                        numberOfSection={course.number_of_section}
                                        isEditCourse={true}
                                        handleDisplayDeleteModal={handleDisplayDeleteModal}
                                        handleEditCourse={handleEditCourse}
                                        enrolled={false}
                                        // createdAt={course.created_at?.toString()}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {totalRecord === 0 && (
                        <p className="mt-4 text-2xl text-error text-center font-bold">Such empty!!!</p>
                    )}
                    {totalPage > 1 && (
                        <div className="flex justify-end my-4">
                            <Pagination
                                handleChangePageIndex={handleChangePageIndex}
                                totalPage={totalPage}
                                currentPage={pageIndex}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* POPUP DELETE
            {isOpenDeleteModal && (
                 <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelDeleteModal} />
            )} */}
        </>
    );
};

export default MyCourses;
