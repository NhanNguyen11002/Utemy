import React, { useRef, useState } from "react";
import { CheckCircleIcon, TrashIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
type props = {
    handleSubmit(requirement: any): void;
    requirement: string[];
};
const RequirementPopup: React.FC<props> = (props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [requirement, setRequirement] = useState(props.requirement);
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
    const handleSubmitRequirement = () => {
        if (inputRef.current) {
            setRequirement([...requirement, inputRef.current.value]);
            inputRef.current.value = "";
            toggleAdd();
        }
    };
    const handleClearRequirement = (index: any) => {
        const copy = [...requirement];
        copy.splice(index, 1);
        setRequirement(copy);
    };
    return (
        <>
            <button type="button" className="btn btn-info btn-outline" onClick={openModal}>
                Xem và thay đổi
            </button>
            <dialog ref={dialogRef} className="w-1/2 max-h-[500px] p-3 rounded-md bg-white text-center">
                <div className="gap-2 flex flex-col mb-2">
                    <label className="text-xl mb-2">Bạn hãy thêm yêu cầu để có thể học được khóa học này</label>
                    {requirement.map((requirement, index) => {
                        return (
                            <div
                                key={index}
                                className="flex rounded-lg bg-navy border border-1 justify-between gap-2 items-center p-2"
                            >
                                <p className=" text-white text-lg truncate">{requirement}</p>
                                <TrashIcon
                                    className="w-6 h-6 text-white hover:cursor-pointer shrink-0"
                                    onClick={() => handleClearRequirement(index)}
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
                                <p className=" text-lightblue">Thêm yêu cầu</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                name="Requirement"
                                placeholder="Sẽ học được gì..."
                                className="input w-full input-info"
                            />
                            <div className="gap-1 flex">
                                <button
                                    type="button"
                                    className="hover:cursor-pointer"
                                    onClick={() => handleSubmitRequirement()}
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
                            props.handleSubmit(requirement);
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

export default RequirementPopup;
