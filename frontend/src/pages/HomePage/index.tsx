import React, { useEffect } from "react";
import { Spin, Carousel as CarouselUtemy } from "../../components";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { categoryActions, courseActions, userActions, cartActions } from "../../redux/slices";
import { Course as CourseType } from "../../types/course";
import { EnrolledAuthor } from "../../types/user";
import CategoryCard from "./CategoryCard";
import { Learning } from "../../assets/images";
import LecturerCard from "./LecturerCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import CarouselCourse from "./CarouselCourse";
import CompanyCard from "../../components/Card/CompanyCard";

const Home: React.FC = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    // const user = useAppSelector((state) => state.authSlice.user);
    // const dummyData = [user, user];
    const dispatch = useAppDispatch();
    const top10Enrolled: CourseType[] = useAppSelector((state) => state.courseSlice.top10Enrolled) ?? [];
    const top10Rate: CourseType[] = useAppSelector((state) => state.courseSlice.top10Rate) ?? [];
    const top8Category = useAppSelector((state) => state.categorySlice.top5categories) ?? [];
    const top10Sale = useAppSelector((state) => state.courseSlice.top10Sale) ?? [];
    const top10AuthorEnrolled: EnrolledAuthor[] = useAppSelector((state) => state.userSlice.top10AuthorEnrolled) ?? [];
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);
    useEffect(() => {
        dispatch(courseActions.getTop10Rate());
        dispatch(courseActions.getTop10Enrolled());
        dispatch(courseActions.getTop10Sale());
        dispatch(userActions.getTop10AuthorByEnrolled());
        dispatch(categoryActions.get5Categories());
    }, [dispatch]);
    useEffect(() => {
        dispatch(courseActions.getAllEnrolled());
        dispatch(cartActions.getAllCart());
    }, [dispatch, isLogin]);
    return (
        <>
            {isGetLoading && <Spin />}

            <div className="flex justify-center my-2 rounded-md">
                <CarouselUtemy />
            </div>
            <div className="w-full h-fill bg-background_2 ">
                <div className="container mx-auto">
                    <CompanyCard />
                </div>
            </div>
            <div className="container mx-auto">
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                        Khóa học <span className="text-lightblue"> nổi tiếng </span>
                    </h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="mt-3 flex shrink-0 gap-3 py-2">
                        <CarouselCourse courses={top10Enrolled} type="enrolled" />
                    </div>
                </div>
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                        Được <span className="text-lightblue">đánh giá cao</span>{" "}
                    </h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="mt-3 flex shrink-0 gap-3 py-2">
                        <CarouselCourse courses={top10Rate} type="rate" />
                    </div>
                </div>
                {top10Sale && top10Sale.length > 0 && (
                    <div className="my-4 px-4">
                        <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                            Đang <span className="text-lightblue">giảm giá</span>{" "}
                        </h2>
                        <span className="w-[60px] h-1 bg-black block"></span>
                        <div className="mt-3 flex shrink-0 gap-3 py-2">
                            <CarouselCourse courses={top10Sale} type="sale" />
                        </div>
                    </div>
                )}
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                        Danh mục <span className="text-lightblue">hàng đầu</span>{" "}
                    </h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full mt-8">
                        <div className="w-full grid grid-cols-4">
                            {top8Category.map((category, index) => {
                                return (
                                    <CategoryCard
                                        key={index}
                                        thumbnail={category.url_image}
                                        title={category.title}
                                        id={category.category_id}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                        Những giảng viên <span className="text-lightblue">hàng đầu</span> của nền tảng
                    </h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full mt-8">
                        <Carousel>
                            <CarouselContent className="">
                                {top10AuthorEnrolled.map((user, index) => {
                                    return (
                                        <CarouselItem className="w-full basis-1/2 ">
                                            <LecturerCard key={index} lecturer={user} />
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>
            </div>
            <div className="w-full h-fill bg-background_2 flex gap-10 justify-center items-center">
                <Learning />
                <div className="flex flex-col gap-2">
                    <p className="text-xl font-bold text-gray-500">
                        Tin tưởng bởi hơn hàng triệu học viên trên toàn thế giới
                    </p>
                    <p className="text-lg text-gray-500">Chinh phục tri thức ngay hôm nay</p>
                    {isLogin ? (
                        <a
                            href="/my-enrolled-courses"
                            className="hover:underline hover:cursor-pointer text-sm text-lightblue"
                        >
                            Tiếp tục học
                        </a>
                    ) : (
                        <a href="/sign-up" className="hover:underline hover:cursor-pointer text-sm text-lightblue">
                            Đăng ký miễn phí ngay hôm nay
                        </a>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
