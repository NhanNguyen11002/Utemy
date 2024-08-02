import { Coupon } from "@prisma/client";
import { DateTime } from "luxon";

export type EventResponse = {
    event_id: number;
    name: string;
    description: string;
    start_date: DateTime | null;
    end_date: DateTime | null;
    is_active: boolean;
    is_delete: boolean;
    coupons: Coupon[];
};
