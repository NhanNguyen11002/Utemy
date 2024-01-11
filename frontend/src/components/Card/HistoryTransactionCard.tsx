import React, { useState } from "react";
import { HistoryTran, HistoryTranItem } from "../../types/invoice";
// ... (other import statements)

type TransactionCardProps = {
    historyTran: HistoryTran;
};

const TransactionCard: React.FC<TransactionCardProps> = ({ historyTran }) => {
    console.log("historyTran in TransactionCard:", historyTran);

    const [isTableVisible, setIsTableVisible] = useState(false);

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
    };
    const truncateString = (str: string, maxLength: number): string => {
        if (str.length > maxLength) {
            return str.substring(0, maxLength) + "...";
        } else {
            return str;
        }
    };
    const [showFullTitle, setShowFullTitle] = useState(false);

    const handleClickEllipsis = () => {
        setShowFullTitle(!showFullTitle);
    };

    return (
        <div className="py-2">
            <div className="flex flex-col gap-2 tablet:gap-4 tablet:flex-row rounded-2xl hover:bg-lightblue/25 transition ease-in-out hover:shadow-lg duration-200 shadow-lg">
                <div className="flex justify-between tablet:flex-1 px-2 pb-2 tablet:px-0">
                    <div className="w-[90%] tablet:w-full p-3">
                        <h2 className="tablet:w-[300px] xl:w-[600px] text-xl font-bold text-title truncate ...">
                            Invoice ID: {historyTran.id}
                        </h2>
                        <p className="text-base font-bold">
                            Create date: {new Date(historyTran.created_at).toLocaleString()}
                        </p>
                        <p className="text-base font-bold">
                            Total Money: {historyTran.total_money.toLocaleString()} VND
                        </p>

                        {/* Display invoice_items information if available */}
                        {historyTran.invoice_detail && (
                            <>
                                <button onClick={toggleTableVisibility} className="text-blue-500">
                                    {isTableVisible ? "Hide Invoice Detail" : "Show Invoice Detail"}
                                </button>
                                {isTableVisible && (
                                    <>
                                        <p className="text-base font-bold">Invoice Detail:</p>
                                        <table className="min-w-full divide-y divide-gray-200 text-center">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 whitespace-nowrap">Thumbnail</th>
                                                    <th className="py-2 whitespace-nowrap">Course Title</th>
                                                    <th className="py-2 whitespace-nowrap">Paid Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historyTran.invoice_detail.map((item: HistoryTranItem) => (
                                                    <tr key={item.id} className="divide-y divide-gray-200">
                                                        <td className="py-2 whitespace-nowrap flex items-center">
                                                            {item.course && (
                                                                <>
                                                                    <img
                                                                        src={item.course.thumbnail}
                                                                        alt="Course Thumbnail"
                                                                        className="max-h-16 max-w-16 object-cover mx-auto"
                                                                    />
                                                                    {/* Display other relevant course information */}
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="py-2 whitespace-pre-line overflow-hidden max-w-200 text-overflow-ellipsis">
                                                            {item.course.title.length > 30 ? (
                                                                showFullTitle ? (
                                                                    <span>{item.course.title}</span>
                                                                ) : (
                                                                    <span
                                                                        className="cursor-pointer text-gray-500"
                                                                        onClick={handleClickEllipsis}
                                                                    >
                                                                        {truncateString(item.course.title, 30)}
                                                                    </span>
                                                                )
                                                            ) : (
                                                                <span>{item.course.title}</span>
                                                            )}
                                                        </td>

                                                        <td className="py-2 whitespace-nowrap">
                                                            {item.paid_price.toLocaleString()}đ
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
