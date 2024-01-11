import React, { useRef, useState } from "react";
import { CheckCircleIcon, TrashIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
type props = {
    handleSubmit(study: any): void;
    study: string[];
};
const StudyPopup: React.FC<props> = (props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [study, setStudy] = useState(props.study);
    const [add, setAdd] = useState(false);
    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };
    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };
    const toggleAdd = () => {
        setAdd(!add);
    };
    const handleSubmitStudy = () => {
        if (inputRef.current) {
            setStudy([...study, inputRef.current.value]);
            inputRef.current.value = "";
            toggleAdd();
        }
    };
    const handleClearStudy = (index: any) => {
        const copy = [...study];
        copy.splice(index, 1);
        setStudy(copy);
    };
    return (
        <>
            <button type="button" className="btn btn-info btn-outline" onClick={openModal}>
                Xem và thay đổi
            </button>
            <dialog ref={dialogRef} className="w-1/2 max-h-[500px] p-3 rounded-md bg-white text-center">
                <div className="gap-2 flex flex-col mb-2">
                    <label className="text-xl mb-2">Bạn hãy thêm tổng quan những gì học viên sẽ học được</label>
                    {study.map((study, index) => {
                        return (
                            <div
                                key={index}
                                className="flex rounded-lg bg-navy border border-1 justify-between gap-2 items-center p-2"
                            >
                                <p className=" text-white text-lg truncate">{study}</p>
                                <TrashIcon
                                    className="w-6 h-6 text-white hover:cursor-pointer shrink-0"
                                    onClick={() => handleClearStudy(index)}
                                />
                            </div>
                        );
                    })}
                </div>

                <div>
                    {!add ? (
                        <>
                            <div
                                className="flex rounded-l  justify-start items-center gap-2 p-2 hover:cursor-pointer"
                                onClick={toggleAdd}
                            >
                                <PlusCircleIcon className="w-4 h-4 text-lightblue" />
                                <p className=" text-lightblue">Thêm thành tựu</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                name="study"
                                placeholder="Sẽ học được gì..."
                                className="input w-full input-info"
                            />
                            <div className="gap-1 flex">
                                <button
                                    type="button"
                                    className="hover:cursor-pointer"
                                    onClick={() => handleSubmitStudy()}
                                >
                                    <CheckCircleIcon className="w-8 h-8 " />
                                </button>
                                <button
                                    type="button"
                                    className="hover:cursor-pointer"
                                    onClick={() => {
                                        if (inputRef.current) {
                                            inputRef.current.value = "";
                                            toggleAdd();
                                        }
                                    }}
                                >
                                    <XCircleIcon className="w-8 h-8 " />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 justify-end mt-3">
                    <button
                        type="button"
                        className="btn btn-info text-white"
                        onClick={() => {
                            props.handleSubmit(study);
                            closeModal();
                        }}
                    >
                        Lưu
                    </button>
                    <button type="button" className="btn" onClick={closeModal}>
                        Hủy
                    </button>
                </div>
            </dialog>
        </>
    );
};

export default StudyPopup;
