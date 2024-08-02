import { apiCallerVnpay } from "../api-config/apiCaller";
import { createPaymentUrl as createPaymentUrlType } from "../types/vnpay";
const createPaymentUrl = async (values: createPaymentUrlType) => {
    const path = "IPN/create_payment_url";
    const reponse = await apiCallerVnpay("POST", path, values);
    return reponse;
};

const vnpayIpn = async (values: any) => {
    const path = `IPN?vnp_Amount=${values.vnp_Amount}&vnp_BankCode=${values.vnp_BankCode}&vnp_BankTranNo=${values.vnp_BankTranNo}&vnp_CardType=${values.vnp_CardType}&vnp_OrderInfo=${values.vnp_OrderInfo}&vnp_PayDate=${values.vnp_PayDate}&vnp_ResponseCode=${values.vnp_ResponseCode}&vnp_TmnCode=${values.vnp_TmnCode}&vnp_TransactionNo=${values.vnp_TransactionNo}&vnp_TransactionStatus=${values.vnp_TransactionStatus}&vnp_TxnRef=${values.vnp_TxnRef}&vnp_SecureHash=${values.vnp_SecureHash}`;
    const reponse = await apiCallerVnpay("POST", path, values);
    return reponse;
};

const vnpayApis = { vnpayIpn, createPaymentUrl };

export default vnpayApis;
