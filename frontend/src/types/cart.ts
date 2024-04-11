import { Course } from "./course";

export type CartItem = {
    cart_detail_id: number;
    saved_for_later: boolean;
    course: Course;
};
export type Cart = {
    cart_id: number;
    cart_items: CartItem[];
};
export type Coupon = {
    id: number;
    code: string;
    discount: number;
    valid_until: string;
    max_discount_money: number;
    remain_quantity: number;
};
