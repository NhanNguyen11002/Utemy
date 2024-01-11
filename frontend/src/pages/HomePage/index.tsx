import React, { useEffect, useRef } from "react";
import { Navbar, Spin, Carousel } from "../../components";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { courseActions } from "../../redux/slices";
import { Course as CourseType } from "../../types/course";
import CardVideo from "./CardVideo";
import { User } from "../../types/user";

const Home: React.FC = () => {
    // const slideRef = useRef(null);
    console.log(useRef);
    const dispatch = useAppDispatch();
    const top10Enrolled: CourseType[] = useAppSelector((state) => state.courseSlice.top10Enrolled) ?? [];
    const top10Rate: CourseType[] = useAppSelector((state) => state.courseSlice.top10Rate) ?? [];
    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    useEffect(() => {
        dispatch(courseActions.getTop10Rate());
        dispatch(courseActions.getTop10Enrolled());
    }, [dispatch]);
    return (
        <>
            <Navbar />
            {isGetLoading && <Spin />}
            {/* <div className="h-[200px] tablet:h-[300px] flex  items-center border-footer border-2 shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 mt-[100px] laptop:mt-0">
                <div className="px-24">
                    <h1 className="text-title text-2xl text-white font-sans tablet:text-[40px] font-bold min-w-fit">
                        Học những kiến thức mới
                    </h1>
                    <p className="text-xl text-white font-sans font-medium">
                        Cùng với nền tảng của chúng tôi chia sẻ và lan rộng kiến thức
                    </p>
                </div>
            </div> */}
            <div className="flex justify-center my-2 rounded-md">
                <Carousel />
            </div>

            <div className="container mx-auto">
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Khóa học nổi tiếng</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full flex overflow-x-scroll">
                        <div className="mt-3 flex shrink-0 gap-3 py-2">
                            {top10Enrolled.map((course: CourseType, index) => {
                                return (
                                    <CardVideo
                                        key={index}
                                        for={"enrolled"}
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
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Được đánh giá cao</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full flex overflow-x-scroll">
                        <div className="mt-3 flex shrink-0 gap-3 py-2">
                            {top10Rate.map((course: CourseType, index) => {
                                return (
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
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[120px] bg-backgroundHover flex flex-col justify-center items-center mt-4">
                <p className="text-xl mb-2 font-bold">Tin tưởng bởi hơn 100000 học viên trên toàn thế giới</p>
                <p className="text-lg">Chinh phục tri thức ngay hôm nay</p>
            </div>
        </>
    );
};

export default Home;
