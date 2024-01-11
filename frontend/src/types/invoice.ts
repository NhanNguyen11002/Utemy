import { Course } from "./course";

export type InvoiceItem = {
    invoice_detail_id: number;
    retail_price: number;
    paid_price: number;
    course: Course;
};
export type Invoice = {
    id: number; //Cai nay cung la invoice id luon
    invoice_id: number;
    is_success: boolean;
    user_id: number;
    total_money: number;
    created_at: Date | string;
    invoice_items: InvoiceItem[];
    invoice_detail: HistoryTranItem[];
};
export type HistoryTran = {
    id: number;
    user_id: number;
    total_money: number;
    is_success: boolean;
    created_at: Date | string;
    invoice_detail: HistoryTranItem[];
};
export type HistoryTranItem = {
    id: number;
    course_id: number;
    retail_price: number;
    paid_price: number;
    course: Course;
};
export type InvoicePaging = {
    page_index: number;
    page_size: number;
    invoice_id: number;
    user_id: number;
    total_money: number;
    is_success: boolean;
    created_at: Date | string;
    invoice_items: InvoiceItem[];
    invoice_detail: HistoryTranItem[];
};
export type PagingInvoice = {
    total_page: number;
    total_record: number;
    data: Invoice[];
};
