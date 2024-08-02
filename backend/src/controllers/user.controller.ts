import express, { Request, Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
import userSchema from "../validations/user.validation";
import { ValidationError } from "joi";
import { ResponseBase, convertJoiErrorToString } from "../common";
export default class UserController {
    async getProfile(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.getProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateProfile(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = userSchema.updateProfileSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.UserService.updateProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeAvatar(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.changeAvatar(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getAuthorProfile(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.getAuthorProfile(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createNewUser(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.createNewUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editUser(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.editUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteUser(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.deleteUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async activeUser(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.activeUser(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllUsers(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.getAllUsers(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10AuthorByAvgRating(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.getTop10AuthorByAvgRating(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10AuthorBySumEnrolled(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.UserService.getTop10AuthorBySumEnrolled(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
