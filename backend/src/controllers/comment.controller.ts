import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class CommentController {
    async createComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.createComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.updateComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.deleteComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.getCommentsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPaginationByLectureId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.getCommentsWithPaginationByLectureId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentsWithPaginationByCourseId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentServices.getCommentsWithPaginationByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}