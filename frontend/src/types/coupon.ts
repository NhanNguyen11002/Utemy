export type Coupon = {
    coupon_id: number;
    code: string;
    discount: number;
    valid_start: string;
    valid_until: string;
    remain_quantity: number;
    is_event: boolean;
    max_discount_money: number;
    event_id: number | null;
    event_name: string | null;
};
export type NewCoupon = {
    code: string;
    discount: number;
    valid_start: string;
    valid_until: string;
    remain_quantity: number;
    is_event: boolean;
    max_discount_money: number;
    event_id: number | null;
};
export type VoucherDropdown = {
    code: string;
    valid_start: string;
    valid_until: string;
    discount: number;
};
export type GetCouponsWithPagination = {
    searchItem: string;
    pageIndex: number;
};