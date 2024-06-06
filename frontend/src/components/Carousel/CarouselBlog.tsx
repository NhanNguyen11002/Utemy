import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";
import BlogCard from "../Card/BlogCard";
import { Blog } from "../../types/blog";

type CarouselBlogProps = {
    blogs: Blog[];
};

const CarouselBlog: React.FC<CarouselBlogProps> = ({ blogs }) => {
    return (
        <>
            <Carousel className="">
                <CarouselContent className="w-[1340px] h-[fit]">
                    {blogs.length > 0 &&
                        blogs.map((blog) => {
                            return (
                                <CarouselItem className="w-full basis-1/4">
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
export default CarouselBlog;
