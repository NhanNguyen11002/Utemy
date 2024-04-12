import { GetCouponsWithPagination } from "@/types/coupon";
import apiCaller from "../api-config/apiCaller";

const getCouponByCode = async (values: string) => {
    const path = `coupon/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCouponById = async (values: number) => {
    const path = `coupon/route/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getAllEventCoupon = async () => {
    const path = `coupon/allevent`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getAllEventCouponByEventId = async (event_id: number) => {
    const path = `coupon/all-coupon-event/${event_id}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getHistorySpinOfUserForAEvent = async (event_id: number) => {
    const path = `coupon/spin-history/${event_id}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createCouponOwner = async( id: number, event_id: number )=> {
    const path =`coupon/owner/`;
    const reponse = await apiCaller("POST", path, { id, event_id });
    return reponse;
};
const createCoupon = async (values: FormData)=> {
    const path ="coupon/";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const updateCoupon = async (coupon_id: number, values: FormData)=> {
    const path =`coupon/${coupon_id}`;
    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const deleteCoupon = async (coupon_id: number)=> {
    const path =`coupon/${coupon_id}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
// const getAllCoupon = async ()=> {
//     const path =`coupon/`;
//     const reponse = await apiCaller("GET", path);
//     return reponse;
// }
const getCouponsWithPagination = async (values: GetCouponsWithPagination) => {
    const path = `coupon/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getVoucherBySpin = async () => {
    const path = `coupon/spin/voucher`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const couponApis = {
    getCouponByCode,
    getAllEventCoupon,
    createCouponOwner,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponsWithPagination,
    getCouponById,
    getAllEventCouponByEventId,
    getHistorySpinOfUserForAEvent,
    getVoucherBySpin,
};

export default couponApis;