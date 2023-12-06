import React, { useEffect, useState } from "react";
import { Navbar } from "../../components";
import { DefaultAvatar } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { userActions } from "../../redux/slices";
import { User } from "../../types/user";
import { useParams } from "react-router-dom";
import { Course } from "../../types/course";
import NotFound from "../NotFound";
import { useNavigate } from "react-router-dom";
import CardVideo from "./CardVideo";

const AuthorProfile: React.FC = () => {
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const navigate = useNavigate();
    const user: User = useAppSelector((state) => state.userSlice.user);
    const loginId = useAppSelector((state) => state.authSlice.user.user_id);
    let courseList: Course[] = useAppSelector((state) => state.userSlice.courses) ?? [];
    let totalEnrolled = 0;
    let totalRating = 0;
    if (courseList.length > 0) {
        courseList.forEach((course) => {
            totalEnrolled += course.number_of_enrolled;
            totalRating += course.number_of_rating;
        });
    }
    const dispatch = useAppDispatch();
    const { id } = useParams();
    useEffect(() => {
        dispatch(userActions.getAuthorProfile(Number(id))).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            } else {
                setIsNotFound(false);
            }
        });
    }, [dispatch, id]);
    if (Number(id) === Number(loginId)) navigate("/my-profile");
    if (isNotFound) return <NotFound />;

    return (
        <>
            <Navbar />
            <div className="container h-full mx-auto px-4 mt-[150px] laptop:mt-0 flex w-1/2">
                <div className="w-2/3 h-full flex flex-col items-starts justify-center gap-2 mt-[50px] p-4">
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
                        <div className="gap-5">
                            <span className=" text-2xl text-black mb-5">Giới thiệu về tôi: </span>
                            <div
                                className="description-course"
                                dangerouslySetInnerHTML={{ __html: user.description }}
                            ></div>
                        </div>
                    </div>
                    <h1 className="text-2xl text-black self-start">Các khóa học của tôi ({courseList.length})</h1>
                    <div className="grid grid-cols-2 gap-7  place-self-start my-3 w-2/3">
                        {courseList.length > 0 &&
                            courseList.map((course: Course, index) => {
                                return (
                                    <div
                                        className="laptop:w-3/4 max-w-xs tablet:max-w-full place-self-center"
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
                </div>
                <div className="px-4 tablet:px-[60px] flex flex-col items-center gap-4  p-4 rounded-lg w-1/3 mt-[50px]">
                    <div className="w-50 h-50 rounded-full border">
                        <img
                            src={user.url_avatar || DefaultAvatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthorProfile;
