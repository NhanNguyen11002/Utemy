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
const createInvoice = async (totalwithcoupon: number, discount: number, id: number|null, maxdiscountamount: number) => {
    const path = "invoice/";
    const response = await apiCaller("POST", path, { totalwithcoupon, discount, id, maxdiscountamount }); // Truyền giá trị total xuống endpoint
    return response;
};

const getHistoryInvoices = async (values: InvoicePaging) => {
    let path = `invoice/all?page_index=${values.page_index}&page_size=${values.page_size}`;
    if (values.from && values.to) {
        path += `&from=${values.from}&to=${values.to}`;
    }
    const response = await apiCaller("GET", path);
    return response;
};


const invoiceApis = {
    getInvoiceNow,
    getHistoryInvoices,
    createInvoice,
    getInvoiceById,
};

export default invoiceApis;
