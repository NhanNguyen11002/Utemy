import services from "../services";
import { ResponseBase } from "../common/response";
import { Request, Response } from "express";
import { IRequestWithId } from "../types/request";
import { convertJoiErrorToString } from "../common";
import { ValidationError } from "joi";

export default class BoxChatController {
    async submitQuestion(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BoxChatServices.submitQuestion(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async checkValidateComment(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.BoxChatServices.checkValidateComment(req);
        return res.status(response.getStatusCode()).json(response);
    }
}