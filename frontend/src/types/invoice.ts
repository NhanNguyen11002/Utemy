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
    from?: string;
    to?: string;
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
export type GetInvoicesWithPagination = {
    searchItem: string;
    pageIndex: number;
};
export type InvoiceInfo = {
    id: number;
    user_id: number;
    total_money: number;
    is_success: boolean;
    created_at: string | Date | undefined;
    invoice_detail: {
        id: number;
        invoice_id: number;
        course_id: number;
        retail_price: number;
        paid_price: number;
        course: {
            course_id: number;
            title: string;
            slug: string;
            status: boolean;
            description: string;
            thumbnail: string;
            summary: string;
            is_delete: boolean;
            created_at: string | Date | undefined;
            updated_at: string | Date | undefined;
            average_rating: number;
            number_of_rating: number;
            number_of_enrolled: number;
            author_id: number;
            price: number;
            sale_price: number | null;
            sale_until: Date | null;
            // Other course information...
        };
    }[];
};
