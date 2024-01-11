import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";
import { convertJoiErrorToString } from "../common";
import categorySchema from "../validations/category.validator";
import { ValidationError } from "joi";

export default class CategoryController {
    async updateCategory(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = categorySchema.updateCategorySchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CategoryServices.updateCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createCategory(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = categorySchema.createCategorySchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CategoryServices.createCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCategory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.deleteCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategory(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.getCategory(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategoriesWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.getCategoriesWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCategories(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.getCategories(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async get5Categories(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CategoryServices.get5Categories(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
