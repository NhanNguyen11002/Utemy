import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";

export default class CommentBlogController {
    async createCommentBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentBlogService.createCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateCommentBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentBlogService.updateCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCommentBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentBlogService.deleteCommentBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentBlogsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentBlogService.getCommentBlogsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCommentBlogsWithPaginationByBlogId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CommentBlogService.getCommentBlogsWithPaginationByBlogId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}