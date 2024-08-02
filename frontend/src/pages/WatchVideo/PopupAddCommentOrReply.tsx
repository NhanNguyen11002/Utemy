// import { useAppSelector } from "../../hooks/hooks";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface PopUpAddCommentOrReplyProps {
    onSave: (content: string) => void;
    onCancel: () => void;
    isSaving: boolean;
    addMode: boolean;
}
const PopUpAddCommentOrReply: React.FC<PopUpAddCommentOrReplyProps> = ({ onSave, onCancel, isSaving, addMode }) => {
    const [content, setContent] = useState("");
    // const isGetLoading1 = useAppSelector(state => state.boxchatSlice.isLoading);

    const handleSave = () => {
        if (content === "") {
            toast.error("Bình luận không được để trống");
        } else {
            onSave(content);
            // Sau khi lưu, clear nội dung và đóng hộp thoại
            // setContent("");
            // onCancel();
        }
    };
    const handleCancel = () => { 
        onCancel(); 
    };
    return (
        <div className="flex items-center justify-between w-full h-full rounded-lg my-0">
            <div className="w-full py-2 px-6 h-full bg-cyan-200/50 rounded-lg my-1 border border-gray-300 ml-16 mr-8">
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="edit-textarea bg-white w-full py-2 px-6 rounded-lg my-1 border border-gray-300"
                    style={{ height: "200px" }}
                    placeholder="Nhập nội dung bình luận..."
                />
                <div className="button-container flex justify-end">
                    <button
                        type="submit"
                        className="text-white btn btn-info text-lg"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <span className="loading loading-spinner"></span> : ""}
                        {isSaving ? "Loading..." : "Lưu"}
                    </button>
                    <button type="button" className="btn text-lg ml-2" onClick={handleCancel}disabled={isSaving}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpAddCommentOrReply;
