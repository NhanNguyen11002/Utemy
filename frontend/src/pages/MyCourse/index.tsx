import React, { useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import CreateIcon from "../../assets/icons/CreateIcon";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { componentActions, courseActions } from "../../redux/slices";
import { Course } from "../../types/course";
import { Spin, Pagination, MyCourseCard as CourseCard } from "../../components";

const MyCourses: React.FC = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [keyword, setKeyword] = useState<string>("");
    const [pageIndex, setPageIndex] = useState<number>(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;
    let totalRecord: number = useAppSelector((state) => state.courseSlice.totalRecord) ?? 0;

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        dispatch(componentActions.setLecturerNavPlace("courses"));
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

    return (
        <>
            {isGetLoading && <Spin />}

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
                        <Link to={"/lecturer/create-course"}>
                            <div className="text-white flex-3 flex btn hover:opacity-80 btn-info text-lg">
                                <CreateIcon />
                                Khóa học mới
                            </div>
                        </Link>
                    </div>
                    <div className="flex-1 grid grid-cols-1">
                        {courseList.map((course, index) => {
                            return (
                                <div className="w-full max-w-xs tablet:max-w-full place-self-center" key={index}>
                                    <CourseCard course={course} key={index} />
                                </div>
                            );
                        })}
                    </div>
                    {totalRecord === 0 && (
                        <p className="mt-4 text-2xl text-error text-center font-bold">Không tìm thấy khóa học</p>
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

export default MyCourses;
