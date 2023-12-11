import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const createCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { code, discount, valid_start, valid_until } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const createCoupon = await configs.db.coupon.create({
            data: {
                code,
                discount: Number(discount),
                valid_until,
            },
        });
        if (createCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        const { code, discount, valid_start, valid_until } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateCoupon = await configs.db.coupon.update({
            data: {
                code,
                discount: Number(discount),
                valid_until,
            },
            where: {
                id: isCouponExsist.id,
            },
        });
        if (updateCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteCoupon = await configs.db.coupon.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isCouponExsist.id,
            },
        });
        if (deleteCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCouponByCode = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { code } = req.params;
        const user_id = Number(req.user_id);
        const isCouponExsist = await configs.db.coupon.findFirst({
            where: {
                code,
                is_delete: false,
                valid_until: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                code: true,
                discount: true,
                valid_until: true,
            },
        });
        if (!isCouponExsist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isCouponUsed = await configs.db.couponHistory.findFirst({
            where: {
                coupon_id: isCouponExsist.id,
                user_id,
            },
        });
        if (isCouponUsed) return new ResponseError(400, constants.error.ERROR_COUPON_USED, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExsist);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const getAllCoupon = await configs.db.coupon.findMany({
            where: {
                is_delete: false,
            },
            select: {
                id: true,
                code: true,
                discount: true,
                valid_until: true,
            },
        });
        if (!getAllCoupon) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getAllCoupon);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const couponService = { createCoupon, updateCoupon, deleteCoupon, getCouponByCode, getAllCoupon };
export default couponService;
