import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";
import multer from "multer";
const upload = multer();
export default class CouponController {
    async createCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData: FormData = req.body;
                    const response: ResponseBase = await services.CouponServices.createCoupon(req, formData);

                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }

    async updateCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData: FormData = req.body;
                    const response: ResponseBase = await services.CouponServices.updateCoupon(req, formData);

                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    async deleteCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.deleteCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponByCode(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getCouponByCode(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.GetCouponsWithPagination(req);
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
    async createCouponOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const coupon_id: number = req.body.id;
        const response: ResponseBase = await services.CouponServices.createCouponOwner(req, coupon_id);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEventCoupon(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getAllEventCoupon(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCouponById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CouponServices.getCouponById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
