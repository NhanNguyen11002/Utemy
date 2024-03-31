import React from "react";
import { images } from "../../assets/";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAppSelector } from "../../hooks/hooks";

const CarouselUtemy = () => {
    const isLogin = useAppSelector((state) => state.authSlice.isLogin) ?? false;
    return (
        <>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                <CarouselContent className="w-[1340px] h-[350px]">
                    <CarouselItem className="w-full relative">
                        <img src={images.Slide2} className="w-full" alt="slide2" />
                        <div className="absolute w-[450px] h-[150px] bg-white left-12 top-1/4 rounded-lg p-4 shadow-md z-10">
                            <h1 className="text-3xl font-bold mb-2"> Kỹ năng thúc đẩy bạn tiến về phía trước</h1>
                            <h3 className="text-md">
                                {" "}
                                <a
                                    className="underline text-lightblue hover:cursor-pointer"
                                    href={`${isLogin ? "/my-enrolled-courses" : "/login"}`}
                                >
                                    Học hỏi
                                </a>{" "}
                                mỗi ngày để nâng cao kiến thức và trở nên tốt hơn mỗi ngày
                            </h3>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="w-full relative ">
                        <img src={images.Slide1} className="w-full" alt="slide2" />
                        <div className="absolute w-[450px] h-[150px] bg-white left-12 top-1/4 rounded-lg p-4 shadow-md z-20">
                            <h1 className="text-3xl font-bold mb-2">Cố gắng mỗi ngày</h1>
                            <h3 className="text-md">
                                {" "}
                                Cố gắng học chỉ 20-30 phút mỗi ngày. Tiếp tục{" "}
                                <a
                                    className="underline text-lightblue hover:cursor-pointer"
                                    href="/my-enrolled-courses"
                                >
                                    hoàn thành khóa học
                                </a>{" "}
                                và phát huy tối đa tiềm năng của bạn.
                            </h3>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="w-full relative">
                        <img src={images.Slide3} className="w-full" alt="slide2" />
                        <div className="absolute w-[450px] h-[150px] bg-white left-12 top-1/4 rounded-lg p-4 shadow-md  z-20">
                            <h1 className="text-3xl font-bold mb-2"> Học hỏi những gì khiến bạn thấy hứng thú</h1>
                            <h3 className="text-md">
                                {" "}
                                Học những kiến thức cho hiện tại (và tương lai của bạn). Hãy bắt đầu cùng chúng tôi
                            </h3>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </>
    );
};
export default CarouselUtemy;
