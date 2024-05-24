import React, { useState } from "react";
import toast from "react-hot-toast";

interface PopUpAddCommentOrReplyProps {
    onSave: (content: string) => void;
    onCancel: () => void;
}

const PopUpAddCommentOrReply: React.FC<PopUpAddCommentOrReplyProps> = ({ onSave, onCancel }) => {
    const [content, setContent] = useState("");

    const handleSave = () => {
        if (content===""){
            toast.error("Bình luận không được để trống")
        }
        else {
            onSave(content);
            // Sau khi lưu, clear nội dung và đóng hộp thoại
            setContent("");
            onCancel();
        }
    };

    return (
        <div className="flex items-center justify-between w-full h-full rounded-lg my-0">
            <div className="w-full py-2 px-6 h-full bg-white rounded-lg my-1 border border-gray-300">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="edit-textarea bg-transparent w-full py-2 px-6 rounded-lg my-1"
                    style={{ height: '200px' }}
                    placeholder="Nhập nội dung bình luận..."
                />
                <div className="button-container flex justify-end">
                    <button type="submit" className="text-white btn btn-info text-lg" onClick={handleSave}>
                        Lưu
                    </button>
                    <button type="button" className="btn text-lg ml-2" onClick={onCancel}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpAddCommentOrReply;
