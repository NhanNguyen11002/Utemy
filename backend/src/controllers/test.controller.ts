import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";

export default class TestController {
    async getTestByTestId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.TestServices.getTestByTestId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createTestHistory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.TestServices.createTestHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTestHistory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.TestServices.getTestHistory(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
