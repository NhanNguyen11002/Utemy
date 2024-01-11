import React from "react";
import { WarningIcon } from "../../../assets/icons";
import { useAppSelector } from "../../../hooks/hooks";

type DeleteUserModalProps = {
    handleDelete: () => void;
    handleCancel: () => void;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = (props: DeleteUserModalProps) => {
    const isLoading = useAppSelector((state) => state.userSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[450px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">Xóa người dùng?</p>
                        <span className="text-xl">Bạn chắc chắn muốn xóa người dùng này?</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={props.handleDelete}>
                            {isLoading ? "Loading..." : " Xóa "}
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

export default DeleteUserModal;
