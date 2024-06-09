import React, { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar/Navbar";
import { CourseCard, Pagination, TotalRating } from "../../components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Course, SearchAllCourses } from "../../types/course";
import { Category } from "../../types/category";
import { categoryActions, courseActions } from "../../redux/slices";
import { eveluateList, sortingBy } from "../../utils/helper";
import useQueryParams from "../../hooks/useQueryParams";
import { User } from "../../types/user";
import { useNavigate } from "react-router-dom";
const AllCourses: React.FC = () => {
    const { keyword, rating, category } = useQueryParams();
    let categoryQuery = category;
    if (typeof categoryQuery === "string") {
        categoryQuery = [Number(category)];
    } else if (typeof categoryQuery === "object") {
        categoryQuery = category.map((cate: string) => Number(cate));
    } else {
        categoryQuery = [];
    }
    const [evaluate, setEvaluate] = useState<number | undefined>(Number(rating));
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>("");
    const [categoryChecked, setCategoryChecked] = useState<number[]>(categoryQuery);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;
    const totalRecord = useAppSelector((state) => state.courseSlice.totalRecord);
    const categoriesList: Category[] = useAppSelector((state) => state.categorySlice.categories) ?? [];

    const handleSingleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
        const { value, checked } = event.target;

        if (checked) {
            setCategoryChecked((pre) => [...pre, categoryId]);
        } else {
            setCategoryChecked((pre) => [...pre.filter((cate) => cate !== Number(value))]);
        }
    };

    // HANDLE FILTER BTN CLICK
    const handleFilterCourse = () => {
        const query: SearchAllCourses = {
            pageIndex: pageIndex,
            keyword: keyword as string,
            sortBy: sortBy,
            rating: Number(evaluate),
            category: categoryChecked,
        };
        dispatch(courseActions.getAllCourses(query));
    };

    // HANDLE SORTING BTN CLICK
    const handleSortingCourse = (sortBy: string) => {
        setSortBy(sortBy);
    };

    // HANDLE RESET BTN CLICK
    const handleResetFilter = () => {
        setEvaluate(undefined);
        setCategoryChecked([]);
        navigate("/all-courses", { replace: true });
        const query: SearchAllCourses = {
            pageIndex: 1,
        };
        dispatch(courseActions.getAllCourses(query));
    };

    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
    };

    useEffect(() => {
        setCategoryChecked(categoryQuery);
        const query: SearchAllCourses = {
            pageIndex: 1,
            category: categoryQuery,
        };
        dispatch(courseActions.getAllCourses(query));
    }, [JSON.stringify(categoryQuery)]);

    useEffect(() => {
        dispatch(categoryActions.getCategories());

        const query: SearchAllCourses = {
            pageIndex: pageIndex,
            keyword: keyword,
            sortBy: sortBy,
            rating: evaluate,
            category: categoryChecked,
        };
        dispatch(courseActions.getAllCourses(query));
    }, [dispatch, keyword, pageIndex, sortBy, evaluate]);

    return (
        <>
            <div className="container mx-auto p-4 mt-[100px] laptop:mt-0">
                <div className="">
                    <div className="flex flex-col gap-4 laptop:flex-row">
                        <div className="w-full laptop:w-[250px] ml-16">
                            <div className="">
                                <button
                                    className="btn btn-info btn-outline text-lg mr-1 hover:text-white"
                                    onClick={handleFilterCourse}
                                >
                                    Áp dụng
                                </button>
                                <div className="dropdown dropdown-bottom mr-1">
                                    <label
                                        tabIndex={0}
                                        className="btn btn-warning btn-outline text-lg m-1 hover:text-white"
                                    >
                                        Sắp xếp
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-[150px]"
                                    >
                                        {sortingBy.map((item, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-footer rounded-lg cursor-pointer"
                                                    onClick={() => handleSortingCourse(item.value)}
                                                >
                                                    {item.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3 w-[70%] ">
                                <h2 className="text-2xl font-bold mb-2 ">Đánh giá</h2>
                                {eveluateList.map((evaluateItem, index) => {
                                    return (
                                        <label
                                            htmlFor={evaluateItem.title}
                                            className={`flex items-center w-fit justify-between mb-1 hover:cursor-pointer ${
                                                evaluate ? (evaluate === 5 - index ? "" : "opacity-30") : ""
                                            } `}
                                            key={index}
                                        >
                                            <div className="flex  gap-2">
                                                <input
                                                    type="radio"
                                                    className="radio radio-info"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        setEvaluate(Number(event.target.value));
                                                    }}
                                                    name="evaluate"
                                                    value={evaluateItem.value}
                                                    id={evaluateItem.title}
                                                    checked={evaluate === evaluateItem.value}
                                                />
                                                <span className="text-xl">{evaluateItem.title}</span>
                                            </div>

                                            <TotalRating
                                                ratingId={`evaluate-${index}`}
                                                totalScore={5 - index}
                                                isForCourse={false}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="hidden tablet:flex divider my-1"></div>
                            <div className="w-full">
                                <h2 className="text-2xl font-bold mb-2">Danh mục</h2>
                                <div className="grid grid-cols-2 laptop:grid-cols-1 w-full">
                                    {categoriesList.length > 0 &&
                                        categoriesList.map((category) => {
                                            return (
                                                <div
                                                    className="flex items-start gap-1 mb-1 max-w-1/2"
                                                    key={category.category_id}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-info"
                                                        name={category.title}
                                                        value={category.category_id}
                                                        checked={categoryChecked.includes(category.category_id)}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleSingleCategoryChange(event, category.category_id)
                                                        }
                                                    />
                                                    <span className="text-xl max-h-14 max-w-[100px] tablet:max-w-full line-clamp-2">
                                                        {category.title}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <button
                                className="btn btn-outline text-sm laptop:text-lg w-2/5 laptop:w-3/4"
                                onClick={handleResetFilter}
                            >
                                Đặt lại
                            </button>
                        </div>
                        <div className="border-t-[1px] w-full laptop:w-[70%] laptop:border-l-[1px] laptop:border-t-0">
                            <div className="w-full flex">
                                {totalRecord === 0 && (
                                    <p className="text-error  text-2xl ml-3">Không có khoá học thoả mãn tiêu chí</p>
                                )}
                                {totalRecord >= 1 && (
                                    <p className="text-2xl ml-3 items-center font-medium">
                                        Tìm thấy {totalRecord} khóa học
                                    </p>
                                )}
                            </div>
                            <div className="flex-1 grid grid-cols-1 pl-3">
                                {courseList.length > 0 &&
                                    courseList.map((course, index) => (
                                        <div
                                            className="w-full max-w-xs tablet:max-w-full place-self-center laptop:place-self-start"
                                            key={index}
                                        >
                                            <CourseCard
                                                id={course.course_id}
                                                title={course.title}
                                                thumbnail={course.thumbnail}
                                                rating={course.average_rating}
                                                status={course.status}
                                                slug={course.slug}
                                                summary={course.summary}
                                                attendees={course.number_of_enrolled}
                                                numberOfSection={course.number_of_section}
                                                author={course.author as User}
                                                isEditCourse={false}
                                                price={course.price}
                                                salePrice={course.sale_price}
                                                saleUntil={course.sale_until?.toString()}
                                                enrolled={true}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
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
        </>
    );
};

export default AllCourses;
