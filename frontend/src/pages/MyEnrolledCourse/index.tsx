import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import { Course } from "../../types/course";
import { Spin, Navbar, Pagination, CourseCard } from "../../components";
import { User } from "../../types/user";

const MyEnrolledCourse: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        dispatch(courseActions.getEnrolledCourses({ pageIndex, keyword }));
    }, [dispatch, keyword, pageIndex]);

    // handle pagination
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };

    // handle search input
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setKeyword(userInput);
        setUserInput("");
    };

    return (
        <>
            {isGetLoading && <Spin />}
            <Navbar />
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="px-4 tablet:px-[60px]">
                    <h1 className="text-center text-[32px] py-4 font-bold text-lightblue text-title">
                        Khóa học đã đăng ký
                    </h1>
                    <div className="w-full flex flex-col gap-4 justify-between shrink-0 tablet:flex-row">
                        <div className="w-3/4 tablet:w-1/2 mx-auto">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Điền từ khóa ở đây..."
                                    className="rounded-full py-4 px-10 w-full border-[1px] border-black"
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
                    </div>
                    <div className="flex-1 grid grid-cols-1">
                        {courseList.map((course, index) => {
                            return (
                                <div className="w-full max-w-xs tablet:max-w-full place-self-center" key={index}>
                                    <CourseCard
                                        id={course.course_id}
                                        thumbnail={course.thumbnail}
                                        slug={course.slug}
                                        title={course.title}
                                        rating={course.average_rating}
                                        summary={course.summary}
                                        author={course.author as User}
                                        attendees={course.number_of_enrolled}
                                        numberOfSection={course.number_of_section}
                                        enrolled={true}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {courseList.length === 0 && (
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
        </>
    );
};

export default MyEnrolledCourse;
