import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import CardVideo from "./CardVideoNew";
import { Course } from "../../types/course";
import { User } from "../../types/user";

type CarouselCourseProps = {
    courses: Course[];
    type: string;
};

const CarouselCourse: React.FC<CarouselCourseProps> = ({ courses, type }) => {
    return (
        <>
            <Carousel className="">
                <CarouselContent className="w-[1340px] h-[fit] p-5">
                    {courses.length > 0 &&
                        courses.map((course, index) => {
                            return (
                                <CarouselItem className="w-full basis-1/5">
                                    <CardVideo
                                        key={index}
                                        for={type}
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
                                        summary={course.summary}
                                        study={course.study}
                                        updatedAt={course.updated_at as Date}
                                    />
                                </CarouselItem>
                            );
                        })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    );
};
export default CarouselCourse;
