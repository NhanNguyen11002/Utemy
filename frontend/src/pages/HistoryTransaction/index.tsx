import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getHistoryInvoices, getInvoiceById } from "../../redux/slices/invoice.slice";
import TransactionCard from "../../components/Card/HistoryTransactionCard";
import { Pagination } from "../../components";

const HistoryTransaction = () => {
    const dispatch = useAppDispatch();
    const [searchInvoiceId, setSearchInvoiceId] = useState<number | string>("");
    // const [currentPage, setCurrentPage] = useState(1);
    const [searchMode, setSearchMode] = useState(false);
    const [searchResult, setSearchResult] = useState<any[]>([]); // Dữ liệu kết quả tìm kiếm
    const historyTrans = useAppSelector((state) => state.invoiceSlice.invoices);
    const totalRecord = useAppSelector((state) => state.invoiceSlice.totalRecourd);
    const [fromDate, setFromDate] = useState<string | string>("");
    const [toDate, setToDate] = useState<string | string>("");
    const totalPage = useAppSelector((state) => state.invoiceSlice.totalPage);
    const [pageIndex, setPageIndex] = useState(1);

    useEffect(() => {
        if (!searchMode) {
            // Gọi API với trang hiện tại khi không ở chế độ tìm kiếm
            dispatch(
                getHistoryInvoices({
                    page_index: 1,
                    page_size: 10,
                    from: fromDate,
                    to: toDate,
                    user_id: 0,
                    total_money: 0,
                    is_success: false,
                    created_at: "",
                    invoice_detail: [],
                    invoice_items: [],
                    invoice_id: 0,
                }),
            );
        }
    }, [dispatch, searchMode, fromDate, toDate]);
    useEffect(() => {
        if (!searchMode) {
            // Gọi API với trang hiện tại khi không ở chế độ tìm kiếm
            dispatch(
                getHistoryInvoices({
                    page_index: pageIndex,
                    page_size: 10,
                    from: fromDate,
                    to: toDate,
                    user_id: 0,
                    total_money: 0,
                    is_success: false,
                    created_at: "",
                    invoice_detail: [],
                    invoice_items: [],
                    invoice_id: 0,
                }),
            );
        }
    }, [dispatch, pageIndex]);

    // const handlePageChange = (newPage: number) => {
    //     setCurrentPage(newPage);
    // };
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleResetClick = () => {
        setSearchMode(false);
        setFromDate("");
        setToDate("");
    };

    const handleSearch = () => {
        if (searchInvoiceId !== "") {
            setSearchMode(true);
            // Gọi hàm dispatch để gửi request API tìm kiếm
            dispatch(getInvoiceById(Number(searchInvoiceId)))
                .then((response) => {
                    // Lưu kết quả tìm kiếm vào state
                    const data = response.payload?.data;
                    // const dataArray = data ? [data] : [];
                    setSearchResult(data ? [data] : []);
                })
                .catch((error) => {
                    // Xử lý khi có lỗi trong quá trình tìm kiếm
                    console.error("Error searching:", error);
                    setSearchResult([]); // Đặt state trở lại rỗng nếu có lỗi
                });
        } else {
            setSearchMode(false); // Set searchMode to false when the search input is empty
            setSearchResult([]); // Clear searchResult when the search input is empty
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="bg-white p-8 rounded shadow-md max-w-[800px] w-full ">
                <div className="flex items-center justify-between mb-4 ">
                    <h1 className="text-3xl text-lightblue font-bold ml-32">Xem lịch sử các giao dịch của bạn</h1>
                </div>
                <div className="mb-4">
                    <label htmlFor="invoiceId" className="text-lg font-semibold">
                        Tìm kiếm theo ID của hóa đơn:
                    </label>
                    <input
                        type="text"
                        id="invoiceId"
                        value={searchInvoiceId}
                        onChange={(e) => setSearchInvoiceId(e.target.value)}
                        className="border p-2 rounded mx-2 w-[350px]"
                    />
                    <button
                        onClick={handleSearch}
                        className="text-white  btn-info btn hover:bg-lightblue/60 focus:outline-none"
                    >
                        Tìm kiếm
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="fromDate" className="text-lg font-semibold">
                        Từ ngày:
                    </label>
                    <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border p-2 rounded mx-2 w-[215px]"
                    />
                    <label htmlFor="toDate" className="text-lg font-semibold">
                        Đến ngày:
                    </label>
                    <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border p-2 rounded mx-2 w-[215px]"
                    />
                    <button
                        className="text-white  btn-info btn hover:bg-lightblue/60 focus:outline-none"
                        onClick={(e) => handleResetClick()}
                    >
                        Làm mới
                    </button>
                </div>
                <div>
                    {searchMode ? (
                        // Hiển thị kết quả tìm kiếm
                        <div>
                            {searchResult.length === 0 ? (
                                <p>Không có giao dịch gần đây.</p>
                            ) : (
                                <div>
                                    <h2>Các kết quả tìm kiếm:</h2>
                                    {searchResult.map((result) => (
                                        <TransactionCard key={result.id} historyTran={result} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Ẩn danh sách lịch sử giao dịch khi ở chế độ tìm kiếm
                        <div>
                            <div className="mb-4 text-center">
                                <p className="text-2xl font-bold">Có {totalRecord} lần giao dịch được tìm thấy</p>
                            </div>{" "}
                            {historyTrans.map((historyTran, index) => (
                                <TransactionCard key={`${historyTran.invoice_id}-${index}`} historyTran={historyTran} />
                            ))}
                        </div>
                    )}
                </div>
                {/* {totalPage > 1 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-blue-500 text-white px-4 py-2 rounded-l"
                        >
                            Previous
                        </button>
                        <span className="mx-2 text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded">
                            {currentPage}
                        </span>
                        <span className="mx-2 text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded">
                            {currentPage+1}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPage}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r"
                        >
                            Next
                        </button>
                    </div>
                )} */}
                {!searchMode && totalPage > 1 && (
                    <div className="flex justify-center my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryTransaction;
