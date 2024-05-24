import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class ReactionCommentBlogController {
    async createReactionCommentBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionCommentBlogServices.createReactionCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteReactionCommentBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionCommentBlogServices.deleteReactionCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTotalReactionsByCommentId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionCommentBlogServices.getTotalReactionsByCommentId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTotalReactionsForAllComments(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReactionCommentBlogServices.getTotalReactionsForAllComments(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
