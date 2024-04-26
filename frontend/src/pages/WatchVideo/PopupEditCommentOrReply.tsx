import React from "react";

type EditPopupProps = {
    commentId: number;
    replyId?: number;
    content: string;
    handleEditPopup: () => void;
    handleCancelPopup: () => void;
};

const PopupEditCommentOrReply: React.FC<EditPopupProps> = (props) => {
    return (
        <div className="fixed z-50 w-full h-full top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                <div className="mb-2 text-center">
                    <p className="text-3xl mb-1 font-medium">Sửa bình luận</p>
                </div>
                <div className="w-full mb-4">
                    <textarea
                        className="w-full p-2 border rounded-md focus:outline-none"
                        rows={4}
                        placeholder={props.content}
                        defaultValue="" // Đặt giá trị mặc định của text area tại đây nếu cần thiết
                    ></textarea>
                </div>
                <div className="w-full flex justify-between">
                    <button className="text-white btn btn-primary text-lg" onClick={()=>props.handleEditPopup}>
                        Lưu
                    </button>
                    <button className="btn text-lg" onClick={props.handleCancelPopup}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupEditCommentOrReply;
