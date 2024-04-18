import services from "../services";
import { ResponseBase } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";

export default class ProgressController {
    async updateProgress(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ProgressServices.updateProgress(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
