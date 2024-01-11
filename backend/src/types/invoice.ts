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
