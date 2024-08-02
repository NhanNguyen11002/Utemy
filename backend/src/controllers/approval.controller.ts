import services from "../services";
import { ResponseBase } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";

export default class ApprovalController {
    async createApproval(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ApprovalServices.createApproval(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getApprovalsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ApprovalServices.getApprovalsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
