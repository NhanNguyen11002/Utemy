import React from "react";
import { PlayCircleIcon, DocumentIcon } from "@heroicons/react/24/outline";
type PopupChoseLectureTypeProps = {
    handleCancel(): void;
    handleOpenAddLesson(): void;
    handleOpenAddTest(): void;
};

const PopupChoseLectureType: React.FC<PopupChoseLectureTypeProps> = (props) => {
    const handleOnClickAddLesson = () => {
        props.handleCancel();
        props.handleOpenAddLesson();
    };
    const handleOnClickAddTest = () => {
        props.handleCancel();
        props.handleOpenAddTest();
    };
    return (
        <div className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <div className="  max-w-[360px] tablet:max-w-[550px] max-h-[630px] tablet:max-h-[1000px] rounded-[12px] bg-white mx-auto p-5 tablet:mx-0 flex-1">
                <div className="w-full p-[12px] flex flex-col items-center gap-3">
                    <h1 className="text-3xl mb-1 font-bold text-center text-lightblue text-title">
                        Chọn kiểu bài giảng
                    </h1>
                    <h1 className="text-xl mb-1 font self-start text-black text-title">Nội dung học tập</h1>
                    <div className="flex gap-6 self-start ">
                        <div
                            onClick={() => handleOnClickAddLesson()}
                            className=" border-2 border-lightblue rounded-md flex flex-col items-center justify-center w-[150px] h-[150px] hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                        >
                            <PlayCircleIcon className="text-lightblue w-10 h-10" />
                            <h1 className="font-bold text-lightblue">Tạo bài học </h1>
                        </div>
                    </div>
                    <h1 className="text-xl mb-1 font self-start text-black text-title">Nội dung kiểm tra</h1>
                    <div className="flex gap-6 self-start">
                        <div
                            onClick={() => handleOnClickAddTest()}
                            className=" border-2 border-lightblue rounded-md flex flex-col items-center justify-center w-[150px] h-[150px] hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                        >
                            <DocumentIcon className="text-lightblue w-10 h-10" />
                            <h1 className="font-bold text-lightblue">Tạo bài kiểm tra</h1>
                        </div>
                    </div>
                    <button onClick={props.handleCancel} className="btn self-end text-black border-black border-2">
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupChoseLectureType;
