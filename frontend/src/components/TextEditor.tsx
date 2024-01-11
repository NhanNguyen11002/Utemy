import React, { useState } from "react";
import ReactQuill from "react-quill";

//{  QuillOptions}
import "react-quill/dist/quill.snow.css"; // Import styles
import "react-quill/dist/quill.bubble.css"; // (Optional) Import additional styles
// interface QuillWithCustomOptions extends QuillOptions {
//     getCustomToolbar(): string[];
// }
type TextEditorProps = {
    description?: string;
    handleChangeDescription(description: string): void;
};
const TextEditor: React.FC<TextEditorProps> = (props) => {
    console.log("TĐN", props.description, props.description ? "true" : "false");
    const [display, setDisplay] = useState<string>(props.description ? props.description : "");
    console.log("display", display);
    // Sử dụng TypeScript với react-quill
    // const modules: QuillWithCustomOptions["modules"] = {
    //     toolbar: {
    //         container: [
    //             [{ header: [1, 2, false] }],
    //             ["bold", "italic", "underline", "strike", "blockquote"],
    //             [{ list: "ordered" }, { list: "bullet" }],
    //             ["link", "image", "video"],
    //             ["clean"],
    //         ],
    //         handlers: {
    //             customButton: function (value: string) {
    //                 // Xử lý khi người dùng nhấn vào nút tùy chỉnh
    //                 console.log("Custom button clicked. Value:", value);
    //             },
    //         },
    //     },
    // };
    const handleOnChange = (description: string) => {
        props.handleChangeDescription(description);
        setDisplay(description);
    };
    return (
        <div>
            <ReactQuill theme="snow" value={display} onChange={handleOnChange} className="h-[200px]" />
        </div>
    );
};
export default TextEditor;
