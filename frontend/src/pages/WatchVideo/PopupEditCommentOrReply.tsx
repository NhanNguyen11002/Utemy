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
                        id="content"
                        className="edit-textarea bg-transparent w-full py-2 px-6 rounded-lg my-1"
                        style={{ height: "200px" }}
                        placeholder={props.content}
                        defaultValue="" // Đặt giá trị mặc định của text area tại đây nếu cần thiết
                    ></textarea>
                </div>
                <div className="button-container flex justify-end">
                    <button type="submit" className="text-white btn btn-info text-lg" onClick={props.handleEditPopup}>
                        Lưu
                    </button>
                    <button type="button" className="btn text-lg ml-2" onClick={props.handleCancelPopup}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupEditCommentOrReply;
