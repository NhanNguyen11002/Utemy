import { apiCallerVnpay } from "../api-config/apiCaller";
import { createPaymentUrl as createPaymentUrlType } from "../types/vnpay";
const createPaymentUrl = async (values: createPaymentUrlType) => {
    const path = "IPN/create_payment_url";
    const reponse = await apiCallerVnpay("POST", path, values);
    return reponse;
};

const vnpayIpn = async (values: any) => {
    const path = "IPN";
    const reponse = await apiCallerVnpay("POST", path, values);
    return reponse;
};

const vnpayApis = { vnpayIpn, createPaymentUrl };

export default vnpayApis;
