import React, { useState, useEffect } from "react";
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
    const [display, setDisplay] = useState<string>("");

    const handleOnChange = (description: string) => {
        props.handleChangeDescription(description);
        setDisplay(description);
    };
    useEffect(() => {
        setDisplay(props.description ? props.description : "");
    }, [props.description]);
    return (
        <div>
            <ReactQuill theme="snow" value={display} onChange={handleOnChange} className="h-[200px]" />
        </div>
    );
};
export default TextEditor;
