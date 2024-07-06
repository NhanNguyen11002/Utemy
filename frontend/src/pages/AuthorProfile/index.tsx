import React, { useEffect, useState, useRef } from "react";
import { CardVideo, Spin, Pagination } from "../../components";
import { DefaultAvatar } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions, courseActions } from "../../redux/slices";
import { User } from "../../types/user";
import { useParams } from "react-router-dom";
import { Course } from "../../types/course";
import NotFound from "../NotFound";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const AuthorProfile: React.FC = () => {
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const user: User = useAppSelector((state) => state.userSlice.user);
    const loginId = useAppSelector((state) => state.authSlice.user.user_id);
    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    const isGetLoadingCourse = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const totalPage = useAppSelector((state) => state.courseSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.courseSlice.totalRecord);
    let totalEnrolled = 0;
    let totalRating = 0;
    if (courseList.length > 0) {
        courseList.forEach((course) => {
            totalEnrolled += course.number_of_enrolled;
            totalRating += course.number_of_rating;
        });
    }
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState<string>("");
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
    };
    const handleSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            const searchItem = inputRef.current.value;
            setSearchItem(searchItem);
        }
    };
    useEffect(() => {
        dispatch(userActions.getAuthorProfile(Number(id))).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                setIsNotFound(false);
            }
        });
    }, [dispatch, id]);
    useEffect(() => {
        dispatch(courseActions.getCourseByAuthorId({ authorId: Number(id), pageIndex, searchItem }));
    }, [pageIndex]);
    useEffect(() => {
        dispatch(courseActions.getCourseByAuthorId({ authorId: Number(id), pageIndex: 1, searchItem }));
    }, [id, searchItem]);
    if (Number(id) === Number(loginId)) navigate("/my-profile");
    if (isNotFound) return <NotFound />;

    return (
        <>
            <div className="container h-full mx-auto px-4 mt-[150px] laptop:mt-0 flex flex-col xl:flex-row-reverse justify-center items-center xl:items-start w-1/2">
                <div className="px-4 tablet:px-[60px] flex flex-col items-center gap-4  p-4 rounded-lg w-1/3 mt-[50px]">
                    <div className=" w-64 h-64 rounded-full border">
                        <img
                            src={user.url_avatar || DefaultAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>
                <div className="w-full xl:w-2/3 h-full flex flex-col items-starts justify-center gap-2 mt-[50px] p-4">
                    <div className="w-full">
                        <h1 className="text-2xl mb-2 mt-30">
                            {((user.first_name as string) + " " + user.last_name) as string}
                        </h1>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-md opacity-80">Tổng học viên</p>
                                <p className="text-2xl text-black font-bold">{totalEnrolled}</p>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-md opacity-80">Đánh giá</p>
                                <p className="text-2xl text-black font-bold">{totalRating}</p>
                            </div>
                        </div>
                        <div className="gap-5 ql-snow">
                            <span className=" text-2xl text-black mb-5">Giới thiệu về tôi: </span>
                            <div
                                className="description-courseql-editor"
                                dangerouslySetInnerHTML={{ __html: user.description }}
                            ></div>
                        </div>
                    </div>
                    <h1 className="text-2xl text-black self-start">Các khóa học của tôi ({courseList.length})</h1>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Điền từ khóa ở đây..."
                        className="rounded-full py-4 px-10 w-full border-[1px] border-black"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    {courseList.length === 0 && (
                        <p className="mt-4 text-2xl text-error text-center font-bold">
                            {" "}
                            {totalRecord === 0
                                ? "Tác giả này chưa có khoá học nào"
                                : "Không tìm thấy khóa học thoả mãn"}
                        </p>
                    )}
                    {isGetLoadingCourse ? (
                        <Spin />
                    ) : (
                        <div className="w-full grid grid-cols-1 laptop:grid-cols-2 gap-1 xl:gap-5  place-self-start my-3 ">
                            {courseList.length > 0 &&
                                courseList.map((course: Course, index) => {
                                    return (
                                        <div
                                            className="laptop:w-3/4 max-w-md tablet:max-w-full place-self-center mb-1"
                                            key={index}
                                        >
                                            <CardVideo
                                                key={index}
                                                for={"rate"}
                                                courseId={course.course_id}
                                                thumbnail={course.thumbnail}
                                                title={course.title}
                                                author={course.author as User}
                                                rating={course.average_rating}
                                                categories={course.categories}
                                                slug={course.slug}
                                                price={Number(course.price)}
                                                salePrice={Number(course.sale_price)}
                                                saleUntil={course.sale_until?.toString()}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    {totalPage > 1 && (
                        <div className="flex justify-start my-4">
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

export default AuthorProfile;
