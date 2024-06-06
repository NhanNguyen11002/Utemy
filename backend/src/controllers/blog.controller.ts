import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";
import { convertJoiErrorToString } from "../common";
import blogSchema from "../validations/blog.validator";
import { ValidationError } from "joi";

export default class BlogController {
    async updateBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = blogSchema.updateBlogSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.BlogService.updateBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = blogSchema.createBlogSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.BlogService.createBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.deleteBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlogsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.getBlogsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlogs(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.getBlogs(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getBlog(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.getBlogBySlug(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async togglePublishedBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.togglePublishedBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async top10Like(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.top10Like(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async top10View(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.top10View(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async searchBlogUserWithPagination(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.searchBlogUserWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getNewestBlogWithPagination(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.getNewestBlogWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async top5RelatedBySlug(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.top5RelatedBySlug(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async reactBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.reactBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getUserReactBySlug(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.getUserReactBySlug(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async increaseViewBlog(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BlogService.increaseViewBlog(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
