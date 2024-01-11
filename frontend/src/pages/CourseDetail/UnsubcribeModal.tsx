import React from "react";
import { WarningIcon } from "../../assets/icons";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { courseActions } from "../../redux/slices";
import { Toaster } from "react-hot-toast";

type UnsubscribeModalProps = {
    handleCancel: () => void;
    course_id: number | undefined;
};

const UnsubscribeModal: React.FC<UnsubscribeModalProps> = (props: UnsubscribeModalProps) => {
    const course_id = props.course_id;
    console.log(course_id);
    // const dispatch = useAppDispatch();
    // const isLoading = useAppSelector((state) => state.courseSlice.isLoading) ?? false;
    const handleUnsubscribeCourse = () => {
        // dispatch(courseActions.unsubcribeCourse({ course_id })).then((response) => {
        //     if (response.payload.status_code === 200) {
        //         toast.success(response.payload.message);
        //         props.handleCancel();
        //     } else {
        //         toast.error(response.payload.message);
        //     }
        // });
    };
    return (
        <>
            <Toaster />
            <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">ARE YOU SURE?</p>
                        <span className="text-xl">Do you really want to unsubcribe this course</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={handleUnsubscribeCourse}>
                            {true ? "Loading..." : "Yes, unsubcribe it"}
                        </button>
                        <button className="btn text-lg ml-2" onClick={props.handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UnsubscribeModal;
