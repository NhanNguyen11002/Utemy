import React from "react";
import { images } from "../assets/";
const CarouselUtemy = () => {
    // const buttonIds = ["btn1", "btn2", "btn3"];
    // let currentIndex = 0;

    // function clickButton() {
    //     const currentButtonId = buttonIds[currentIndex];
    //     const currentButton = document.getElementById(currentButtonId);

    //     if (currentButton) {
    //         currentButton.click();
    //         currentIndex = (currentIndex + 1) % buttonIds.length; // Move to the next button or loop back to the first one
    //     }
    // }

    // // Start the infinite loop
    // setInterval(clickButton, 3000);
    return (
        <>
            <div className="carousel w-[1340px] h-[350px]">
                {/* <div id="slide1" className="carousel-item relative w-full">
                    <img src={images.Slide1} className="w-full" alt="slide1" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide4" className="btn btn-circle">
                            ❮
                        </a>
                        <a href="#slide2" className="btn btn-circle" id="btn1">
                            ❯
                        </a>
                    </div>
                </div> */}
                <div id="slide2" className="carousel-item relative w-full">
                    <img src={images.Slide2} className="w-full" alt="slide2" />
                    <div className="absolute w-[450px] h-[150px] bg-white left-12 top-1/4 rounded-lg p-4 shadow-md">
                        <h1 className="text-3xl font-bold mb-2"> Chậm mà chắc</h1>
                        <h3 className="text-md">
                            {" "}
                            Cố gắng học chỉ 5–10 phút mỗi ngày. Tiếp tục{" "}
                            <a className="underline text-lightblue hover:cursor-pointer" href="/my-enrolled-courses">
                                hoàn thành khóa học
                            </a>{" "}
                            và phát huy tối đa tiềm năng của bạn.
                        </h3>
                    </div>
                    {/* <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide1" className="btn btn-circle">
                            ❮
                        </a>
                        <a href="#slide3" className="btn btn-circle" id="btn2">
                            ❯
                        </a>
                    </div> */}
                </div>
                {/* <div id="slide3" className="carousel-item relative w-full">
                    <img src={images.Slide3} className="w-full" alt="slide3" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide2" className="btn btn-circle">
                            ❮
                        </a>
                        <a href="#slide1" className="btn btn-circle" id="btn3">
                            ❯
                        </a>
                    </div>
                </div> */}
            </div>
        </>
    );
};
export default CarouselUtemy;
