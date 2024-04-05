import apiCaller from "../api-config/apiCaller";
import { InvoicePaging } from "../types/invoice";

const getInvoiceNow = async () => {
    const path = "invoice/";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getInvoiceById = async (values: number) => {
    const path = `invoice/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createInvoice = async (totalwithcoupon: number, discount: number, id: number|null) => {
    const path = "invoice/";
    const response = await apiCaller("POST", path, { totalwithcoupon, discount, id }); // Truyền giá trị total xuống endpoint
    return response;
};

const getHistoryInvoices = async (values: InvoicePaging) => {
    const path = `invoice/all?page_index=${values.page_index}&page_size=${values.page_size}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};

const invoiceApis = {
    getInvoiceNow,
    getHistoryInvoices,
    createInvoice,
    getInvoiceById,
};

export default invoiceApis;
