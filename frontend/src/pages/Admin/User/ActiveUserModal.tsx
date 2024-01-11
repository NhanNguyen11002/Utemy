import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { CheckIcon } from "@heroicons/react/24/outline";

type ActiveUserModalProps = {
    handleActive: () => void;
    handleCancel: () => void;
};

const ActiveUserModal: React.FC<ActiveUserModalProps> = (props: ActiveUserModalProps) => {
    const isLoading = useAppSelector((state) => state.userSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[500px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-green-700 mb-4 flex justify-center text-white items-center">
                        <CheckIcon className="w-6 h-6" />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">Khôi phục người dùng?</p>
                        <span className="text-xl">Bạn chắc chắn muốn khôi phục người dùng này ?</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-info text-lg" onClick={props.handleActive}>
                            {isLoading ? "Loading..." : "Khôi phục "}
                        </button>
                        <button className="btn text-lg ml-2" onClick={props.handleCancel}>
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActiveUserModal;
