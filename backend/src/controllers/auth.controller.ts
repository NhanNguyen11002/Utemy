import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
import authSchema from "../validations/auth.validator";
import { ValidationError } from "joi";

import { convertJoiErrorToString } from "../common";

export default class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = authSchema.loginSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.AuthServices.login(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async signup(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = authSchema.signupSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.AuthServices.signup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async refreshAccesToken(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.AuthServices.refreshAccessToken(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async verifyEmail(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.AuthServices.verifyEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async forgotPassword(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = authSchema.forgotPasswordSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.AuthServices.forgotPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resetPassword(req: Request, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = authSchema.resetPasswordSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.AuthServices.resetPassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changePassword(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = authSchema.changePasswordSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.AuthServices.changePassword(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getMe(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.AuthServices.getMe(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resendVerifyEmail(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.AuthServices.resendVerifyEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async resendForgotPasswordEmail(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.AuthServices.resendForgotPasswordEmail(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
