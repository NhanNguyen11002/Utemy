import { Coupon } from "./coupon";

export type Event = {
    event_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: number;
    coupons: Coupon[];
}
export type EventForSpin = {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: number;
}
export type NewEvent = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: number;
};
export type GetEventsWithPagination = {
    searchItem: string;
    pageIndex: number;
};