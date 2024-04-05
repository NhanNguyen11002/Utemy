import React, { useState } from "react";
import ReactQuill from "react-quill";

//{  QuillOptions}
import "react-quill/dist/quill.snow.css"; // Import styles
import "react-quill/dist/quill.bubble.css"; // (Optional) Import additional styles
// interface QuillWithCustomOptions extends QuillOptions {
//     getCustomToolbar(): string[];
// }
type TextEditorProps = {
    content?: string;
    handleChangeContent(content: string): void;
};
const TextEditor: React.FC<TextEditorProps> = (props) => {
    const [display, setDisplay] = useState<string>(props.content ? props.content : "");
    let quillObj: any;
    console.log(quillObj);
    const imageHandler = async () => {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            if (!input || !input.files) return;
            else {
                let file: any = input.files[0];
                let formData = new FormData();

                formData.append("evidence", file);
            }
        };
    };
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["link", "image"],
                ["clean"],
                [{ color: [] }],
            ],
            handlers: {
                image: imageHandler,
            },
        },
        table: true,
    };

    const handleOnChange = (content: string) => {
        props.handleChangeContent(content);
        setDisplay(content);
    };
    return (
        <div>
            <ReactQuill
                ref={(el) => {
                    quillObj = el;
                }}
                theme="snow"
                value={display}
                modules={modules}
                onChange={handleOnChange}
                className="h-[200px]"
            />
        </div>
    );
};
export default TextEditor;
