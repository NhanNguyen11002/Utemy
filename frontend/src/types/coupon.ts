export type Coupon = {
    coupon_id: number;
    code: string;
    discount: number;
    valid_start: string;
    valid_until: string;
    remain_quantity: number;
    is_event: boolean;
};
export type NewCoupon = {
    code: string;
    discount: number;
    valid_start: string;
    valid_until: string;
    remain_quantity: number;
    is_event: boolean;
};
export type GetCouponsWithPagination = {
    searchItem: string;
    pageIndex: number;
};