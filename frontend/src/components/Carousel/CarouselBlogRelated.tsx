import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import BlogCard from "../Card/BlogCard";
import { Blog } from "../../types/blog";

type CarouselBlogRelatedProps = {
    blogs: Blog[];
};

const CarouselBlogRelated: React.FC<CarouselBlogRelatedProps> = ({ blogs }) => {
    return (
        <>
            <Carousel className="">
                <CarouselContent className="w-[1340px] h-[fit]">
                    {blogs.length > 0 &&
                        blogs.map((blog) => {
                            return (
                                <CarouselItem key={blog.blog_id} className="w-full basis-1/3">
                                    <BlogCard blog={blog} author={blog.author} isAdmin={false} />
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
export default CarouselBlogRelated;
