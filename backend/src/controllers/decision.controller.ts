import services from "../services";
import { ResponseBase } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";

export default class DecisionController {
    async createDecision(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.DecisionServices.createDecision(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getDecisionsByCourseId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.DecisionServices.getDecisionsByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
