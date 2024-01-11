import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";

export default class CartController {
    async addCourseToCart(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CartServices.addCourseToCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async removeCourseFromCart(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CartServices.removeCourseFromCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeSaveForLater(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CartServices.changeSaveForLater(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllCart(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CartServices.getAllCart(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
