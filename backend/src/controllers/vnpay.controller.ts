import { ResponseBase, ResponseSuccess } from "../common/response";
import { Response, Request } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class VnpayController {
    async vnpayIpn(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.VnpayServices.vnpayIpn(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createPaymentUrl(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.VnpayServices.createPaymentUrl(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
