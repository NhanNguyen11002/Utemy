import React, { useState, useMemo, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
//{  QuillOptions}
import "react-quill/dist/quill.snow.css"; // Import styles
import "react-quill/dist/quill.bubble.css"; // (Optional) Import additional styles
import { useAppDispatch } from "../../hooks/hooks";
import { decisionActions } from "../../redux/slices";
import toast from "react-hot-toast";
import ImageResize from "quill-image-resize-module-react";
import BlotFormatter, { AlignAction, DeleteAction, ImageSpec, ResizeAction } from "quill-blot-formatter";
const BaseImageFormat = Quill.import("formats/image");
const ImageFormatAttributesList = ["alt", "height", "width", "style"];

class ImageFormat extends BaseImageFormat {
    static formats(domNode: any) {
        return ImageFormatAttributesList.reduce(function (formats: any, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});
    }
    format(name: any, value: any) {
        if (ImageFormatAttributesList.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}

Quill.register(ImageFormat, true);

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/blotFormatter", BlotFormatter);

class CustomImageSpec extends ImageSpec {
    getActions() {
        return [AlignAction, DeleteAction, ResizeAction];
    }
}

type TextEditorWithImageProps = {
    propRef?: React.MutableRefObject<any>;
    content?: string;
    height?: number;
    handleChangeContent(content: string): void;
};
const TextEditorWithImage: React.FC<TextEditorWithImageProps> = (props) => {
    const [display, setDisplay] = useState<string>("");
    const dispatch = useAppDispatch();
    let quillObj = useRef<any>();
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
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["link", "image", "formula"],
                    ["clean"],
                    [{ color: [] }],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            blotFormatter: {
                specs: [CustomImageSpec],
                overlay: {
                    className: "blot-formatter__overlay",
                    style: {
                        position: "absolute",
                        boxSizing: "border-box",
                        border: "1px dashed #444",
                    },
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
                ref={(el) => {
                    quillObj.current = el;
                    if (props.propRef) props.propRef.current = el;
                }}
                theme="snow"
                value={display}
                modules={modules}
                onChange={handleOnChange}
                className={`${props.height ? `h-[${props.height}px]` : "h-[200px]"} display:block z-20`}
            />
        </div>
    );
};
export default TextEditorWithImage;
