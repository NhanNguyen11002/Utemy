import React from "react";
import { Spin } from "../../components";
import { useAppSelector } from "../../hooks/hooks";
// import { categoryActions, courseActions, userActions } from "../../redux/slices";
// import { Course as CourseType } from "../../types/course";
// import { EnrolledAuthor } from "../../types/user";

// import { Learning } from "../../assets/images";

// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel";

const BlogHome: React.FC = () => {
    // const isLogin = useAppSelector((state) => state.authSlice.isLogin);
    // const dispatch = useAppDispatch();
    // const top10Enrolled: CourseType[] = useAppSelector((state) => state.courseSlice.top10Enrolled) ?? [];
    // const top10Rate: CourseType[] = useAppSelector((state) => state.courseSlice.top10Rate) ?? [];
    // const top8Category = useAppSelector((state) => state.categorySlice.top5categories) ?? [];
    // const top10Sale = useAppSelector((state) => state.courseSlice.top10Sale) ?? [];
    // const top10AuthorEnrolled: EnrolledAuthor[] = useAppSelector((state) => state.userSlice.top10AuthorEnrolled) ?? [];
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    // useEffect(() => {
    //     dispatch(courseActions.getTop10Rate());
    //     dispatch(courseActions.getTop10Enrolled());
    //     dispatch(courseActions.getTop10Sale());
    //     dispatch(userActions.getTop10AuthorByEnrolled());
    //     dispatch(categoryActions.get5Categories());
    // }, [dispatch]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div>
                <p className="text-5xl"> blog home</p>
            </div>
        </>
    );
};

export default BlogHome;
