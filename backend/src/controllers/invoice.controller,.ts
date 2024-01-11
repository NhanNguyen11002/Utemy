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
        const response: ResponseBase = await services.InvoiceServices.createInvoice(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getInvoiceById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.InvoiceServices.getInvoiceById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
