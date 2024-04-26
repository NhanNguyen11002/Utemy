import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class ReactionController {
    async createLike(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.createLike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteLike(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.deleteLike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createDislike(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.createDislike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteDislike(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.deleteDislike(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async checkLikeExist(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.checkLikeExist(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async checkDislikeExist(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionServices.checkDislikeExist(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
