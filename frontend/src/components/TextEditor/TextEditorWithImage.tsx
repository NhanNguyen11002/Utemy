import React, { useState, useMemo, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
//{  QuillOptions}
import "react-quill/dist/quill.snow.css"; // Import styles
import "react-quill/dist/quill.bubble.css"; // (Optional) Import additional styles
import { useAppDispatch } from "../../hooks/hooks";
import { decisionActions } from "../../redux/slices";
import toast from "react-hot-toast";
type TextEditorWithImageProps = {
    content?: string;
    handleChangeContent(content: string): void;
};
const TextEditorWithImage: React.FC<TextEditorWithImageProps> = (props) => {
    const [display, setDisplay] = useState<string>("");
    const dispatch = useAppDispatch();
    const quillObj = useRef<any>();
    const imageHandler = async (img: any) => {
        const input = document.createElement("input");

        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            if (!input || !input.files) return;
            else {
                let file: any = input.files[0];
                let formData = new FormData();

                formData.append("evidence_image", file);

                dispatch(decisionActions.uploadEvidence(formData)).then((res) => {
                    if (res.payload && res.payload.data) {
                        const range = quillObj.current.getEditorSelection();
                        quillObj.current.getEditor().insertEmbed(range.index, "image", res.payload.data);
                    } else toast.error("Something wrong happened");
                });
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline"],
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
        }),
        [],
    );
    useEffect(() => {
        setDisplay(props.content ? props.content : "");
    }, [props.content]);
    const handleOnChange = (content: string) => {
        props.handleChangeContent(content);
        setDisplay(content);
    };
    return (
        <div>
            <ReactQuill
                ref={quillObj}
                theme="snow"
                value={display}
                modules={modules}
                onChange={handleOnChange}
                className="h-[200px] display:block z-20"
            />
        </div>
    );
};
export default TextEditorWithImage;
