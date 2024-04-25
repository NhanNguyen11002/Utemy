import React from "react";
import { FaceSmileIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { TestHistoryResponse } from "../../types/test";
import { convertStringDate } from "../../utils/helper";
type HistoryCardProps = {
    history: TestHistoryResponse;
};
const HistoryCard: React.FC<HistoryCardProps> = (props) => {
    return (
        <>
            <div className="flex gap-2 text-black border-2 border-black rounded-md p-3 w-fit justify-between items-center">
                <div className="flex gap-2 items-center">
                    {props.history.is_pass ? (
                        <FaceSmileIcon className="w-8 h-8 text-success shrink-0" />
                    ) : (
                        <FaceFrownIcon className="w-8 h-8 text-error shrink-0" />
                    )}

                    <div className="flex flex-col">
                        <h1>
                            Số câu đúng:{" "}
                            <span className="font-bold">
                                {props.history.total_score}/{props.history.total_question}
                            </span>
                        </h1>
                        <h1>Đạt {props.history.total_percent}/100 điểm</h1>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1>Ngày kiểm tra </h1>
                    <h1>{convertStringDate(props.history.created_at)}</h1>
                </div>
            </div>
        </>
    );
};

export default HistoryCard;
