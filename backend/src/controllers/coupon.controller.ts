import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";

export default class CouponController {
    async createCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.createCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.updateCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.deleteCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponByCode(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getCouponByCode(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getAllCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }

    //coupon-history controller
    async createCouponHistory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.createCouponHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponHistoryByUserId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getCouponHistoryByUserId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCouponHistory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getAllCouponHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
