import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class ReplyCommentController {
    async createReplyComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReplyCommentServices.createReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateReplyComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReplyCommentServices.updateReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteReplyComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReplyCommentServices.deleteReplyComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getReplyCommentsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReplyCommentServices.getReplyCommentsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
}