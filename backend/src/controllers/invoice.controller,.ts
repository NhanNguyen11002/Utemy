import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class InvoiceController {
    async getAllInvoices(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.InvoiceServices.getAllInvoices(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getNowInvoice(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.InvoiceServices.getNowInvoice(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createInvoice(req: IRequestWithId, res: Response): Promise<Response> {
        try {
            const total: number = req.body.totalwithcoupon;
            const discount: number = req.body.discount;
            const coupon_id: number | null = req.body.id;
            const max_discount_money: number = req.body.maxdiscountamount;
            const response: ResponseBase = await services.InvoiceServices.createInvoice(
                req,
                total,
                discount,
                coupon_id,
                max_discount_money,
            );

            return res.status(response.getStatusCode()).json(response);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getInvoiceById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.InvoiceServices.getInvoiceById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
