import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";

export default class LectureController {
    async createLecture(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LectureServices.createLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateLecture(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LectureServices.updateLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLecture(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LectureServices.deleteLecture(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getLectureById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.LectureServices.getLectureById(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
