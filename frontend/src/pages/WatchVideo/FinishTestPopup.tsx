import React from "react";

type FinishTestPopupProps = {
    handleFinish(): void;
    handleCancel(): void;
};
const FinishTestPopup: React.FC<FinishTestPopupProps> = (props) => {
    return (
        <>
            <div
                className=" absolute z-50 left-0 w-full h-full flex flex-col items-center justify-center bg-black/20 round"
                onClick={(e) => {
                    if (e.target === e.currentTarget) props.handleCancel();
                    else return;
                }}
            >
                <div className="h-[200px] w-[250px] items-center justify-center bg-white rounded-md flex flex-col gap-2">
                    <h1 className="font-bold text-2xl text-black text-center">Bạn chắc chắn muốn nộp bài?</h1>
                    <div className="flex gap-2 items-center justify-center">
                        <button
                            type="button"
                            className="btn btn-error text-white hover:text-error hover:bg-white hover: border-error border-2 "
                            onClick={props.handleFinish}
                        >
                            Nộp bài
                        </button>
                        <button type="button" className="btn btn-outline text-black" onClick={props.handleCancel}>
                            {" "}
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FinishTestPopup;
