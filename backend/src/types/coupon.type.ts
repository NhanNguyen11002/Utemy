import { DateTime } from "luxon";

export type CouponWhereInput = {
    [x: string]: "asc" | "desc" | { _count?: "asc" | "desc" } | undefined;
    valid_start?: "asc" | "desc" | undefined;
    discount?: "asc" | "desc" | undefined;
    valid_until?: "asc" | "desc" | undefined;
    remain_quantity?: "asc" | "desc" | undefined;
};

export type CouponResponse = {
    coupon_id: number;
    code: string;
    discount: number;
    is_delete: boolean;
    valid_start: DateTime | null;
    valid_until: DateTime | null;
    remain_quantity: number;
    is_event: boolean;
}