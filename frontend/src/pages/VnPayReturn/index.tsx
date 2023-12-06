import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useQueryParams from "../../hooks/useQueryParams";
import { useAppDispatch } from "../../hooks/hooks";
import { vnpayActions, cartActions } from "../../redux/slices";

const VnPayReturn = () => {
    const dispatch = useAppDispatch();
    const {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
    } = useQueryParams();
    const data = {
        vnp_Amount,
        vnp_BankCode,
        vnp_CardType,
        vnp_BankTranNo,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
    };
    useEffect(() => {
        dispatch(vnpayActions.vnpayIpn(data)).then((response) => {
            if (response.payload?.status_code === 200) dispatch(cartActions.getAllCart());
        });
    }, [dispatch]);
    const success = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";
    const invoiceId = vnp_OrderInfo.split(":")[1];
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-[500px] w-full">
                <h1 className="text-3xl text-lightblue font-bold mb-4">
                    {success ? "Payment Successful" : "Payment Failed"}
                </h1>
                <h2 className="text-2xl font-bold mb-4">Thông tin đơn hàng</h2>
                <p>Mã hóa đơn: {invoiceId}</p>
                <p>Tổng số tiền: đ{(vnp_Amount / 100).toLocaleString()}</p>
                <p>Mã ngày thanh toán: {vnp_PayDate}</p>
                {success ? (
                    <p className="text-gray-600 mb-6">Cảm ơn vi đã tin tưởng Utemy, giao dịch của bạn đã thành công</p>
                ) : (
                    <p className="text-gray-600 mb-6">Có vẻ đã có vấn đề với giao dịch của bạn. Vui lòng thử lại sau</p>
                )}

                <Link to="/history-transaction" className="flex flex-col items-center justify-center">
                    <button className="text-white btn-info btn hover:bg-lightblue/60 focus:outline-none">
                        Trở về trang lịch sử giao dịch
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default VnPayReturn;
