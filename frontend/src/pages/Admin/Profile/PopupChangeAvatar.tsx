import { userActions } from "../../../redux/slices";
import React, { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import toast from "react-hot-toast";
type props = {
    handleAfterChangeAvatar(): void;
    urlAvatar: string;
};
const FILE_TOO_BIG = 1;
const FILE_IS_NOT_SUPPORT = 2;
const FILE_IS_EMPTY = 3;
const FILE_SUPPORT = ["image/jpeg", "image/png", "image/jpg"];
const PopUpChangeAvatar: React.FC<props> = (props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const avatarRef = useRef<HTMLImageElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoading: boolean = useAppSelector((state) => state.userSlice.isLoading);
    const [errorImage, setErrorImage] = useState<number>(FILE_IS_EMPTY);
    const dispatch = useAppDispatch();
    const openModal = () => {
        if (dialogRef.current) {
            setErrorImage(0);
            dialogRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (dialogRef.current) {
            setErrorImage(0);
            dialogRef.current.close();
            if (avatarRef.current!.src) {
                avatarRef.current!.src = props.urlAvatar;
            }
            if (inputRef.current!.value) {
                inputRef.current!.value = "";
            }
            props.handleAfterChangeAvatar();
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files![0];
        if (file) {
            if (avatarRef.current!.src) {
                avatarRef.current!.src = URL.createObjectURL(file);
                if (file.size >= 1024 * 1024 * 4) {
                    setErrorImage(FILE_TOO_BIG);
                } else if (!FILE_SUPPORT.includes(file.type)) {
                    setErrorImage(FILE_IS_NOT_SUPPORT);
                } else {
                    setErrorImage(0);
                }
            }
        } else {
            setErrorImage(FILE_IS_EMPTY);
            avatarRef.current!.src = props.urlAvatar;
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (inputRef.current!.value) {
            const formData = new FormData();
            formData.set("avatar", inputRef.current?.files?.[0] as File);
            dispatch(userActions.changeAvatar(formData)).then((response) => {
                if (response.payload?.status_code === 200) {
                    toast.success(response.payload.message);
                    closeModal();
                } else {
                    if (response.payload) toast.error(response.payload.message);
                }
            });
        } else {
            setErrorImage(FILE_IS_EMPTY);
        }
    };
    return (
        <>
            <img
                ref={avatarRef}
                src={props.urlAvatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full cursor-pointer"
                onClick={openModal}
            />
            <dialog ref={dialogRef} className="modal text-center">
                <form className="modal-box" onSubmit={handleSubmit}>
                    <img
                        ref={avatarRef}
                        src={props.urlAvatar}
                        alt="Avatar"
                        className="w-52 h-52 my-2 object-cover rounded-full mx-auto"
                    />

                    <input
                        ref={inputRef}
                        accept=".jpg, .png"
                        type="file"
                        className="file-input file-input-bordered file-input-info w-full max-w-xs"
                        onChange={handleFileInputChange}
                    />
                    {errorImage === FILE_TOO_BIG ? (
                        <p className={`text-error italic font-medium mt-1`}>Kích thước hình nhỏ hơn 4MB</p>
                    ) : (
                        <></>
                    )}
                    {errorImage === FILE_IS_NOT_SUPPORT ? (
                        <p className={`text-error italic font-medium mt-1`}>
                            Loại tệp không hỗ trợ, vui lòng chọn JPG, JPEG, PNG
                        </p>
                    ) : (
                        <></>
                    )}
                    {errorImage === FILE_IS_EMPTY ? (
                        <p className={`text-error italic font-medium mt-1`}>Hình trống</p>
                    ) : (
                        <></>
                    )}
                    <div className="modal-action flex justify-center">
                        <button
                            className={`btn btn-info text-white text-lg ${isLoading ? "btn-disabled" : ""}`}
                            type="submit"
                        >
                            {isLoading && <span className="loading loading-spinner"></span>}
                            {isLoading ? "Loading..." : "Lưu"}
                        </button>
                        <button
                            className={`btn text-lg ${isLoading ? "btn-disabled" : ""}`}
                            type="button"
                            onClick={closeModal}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    );
};

export default PopUpChangeAvatar;
