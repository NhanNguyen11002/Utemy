import React from "react";
import { WarningIcon } from "../../../assets/icons";
import { useAppSelector } from "../../../hooks/hooks";

type ConfirmModalProps = {
    handleConfirm: () =>void;
    handleCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => {
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading) ?? false;
    return (
        <>
            <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">Bạn chắc chắn muốn thêm coupon vào event này?</p>
                        <span className="text-xl">
                            Hành động cập nhật coupon cho event sẽ reset tất cả các tỉ lệ quay (nếu có) của các coupon
                            khác trong cùng event
                        </span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={props.handleConfirm}>
                            {isLoading ? "Loading..." : " Có, tôi muốn sửa "}
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

export default ConfirmModal;
