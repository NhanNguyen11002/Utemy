import { CheckCircleIcon, TrashIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
type StudyProps = {
    handleSubmit(study: any): void;
    setEdit(edit: boolean): void;
    study: string[];
};
const Study: React.FC<StudyProps> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [add, setAdd] = useState(false);
    const toggleAdd = (bool: boolean) => {
        setAdd(bool);
        props.setEdit(bool);
    };
    const handleSubmitStudy = () => {
        if (inputRef.current) {
            props.handleSubmit([...props.study, inputRef.current.value]);
            inputRef.current.value = "";
            toggleAdd(false);
        }
    };
    const handleClearStudy = (index: any) => {
        const copy = [...props.study];
        copy.splice(index, 1);
        props.handleSubmit(copy);
    };
    return (
        <div className="my-3">
            <div className="flex flex-col gap-2 my-2">
                {props.study.map((study: any, index: any) => {
                    return (
                        <div
                            key={index}
                            className="flex bg-navy border border-1 justify-between gap-2 items-center p-2"
                        >
                            <p className=" text-white text-lg truncate p-1">{study}</p>
                            <TrashIcon
                                className="w-6 h-6 text-white hover:cursor-pointer shrink-0"
                                onClick={() => handleClearStudy(index)}
                            />
                        </div>
                    );
                })}
            </div>
            {!add ? (
                <>
                    <div
                        className="flex rounded-l justify-start items-center gap-2 p-2 hover:cursor-pointer"
                        onClick={() => toggleAdd(true)}
                    >
                        <PlusCircleIcon className="w-5 h-5 text-lightblue" />
                        <p className=" text-lightblue">Thêm nội dung đạt được</p>
                    </div>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        name="Study"
                        placeholder="Sẽ học được gì..."
                        className="input w-full input-info"
                    />
                    <div className="gap-1 flex">
                        <button type="button" className="hover:cursor-pointer" onClick={() => handleSubmitStudy()}>
                            <CheckCircleIcon className="w-8 h-8 " />
                        </button>
                        <button
                            type="button"
                            className="hover:cursor-pointer"
                            onClick={() => {
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                    toggleAdd(false);
                                }
                            }}
                        >
                            <XCircleIcon className="w-8 h-8 " />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Study;
