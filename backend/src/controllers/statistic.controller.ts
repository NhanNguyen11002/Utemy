import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
// import authSchema from "../validations/auth.validator";
// import { ValidationError } from "joi";
// import { convertJoiErrorToString } from "../common";

export default class StatisticController {
    async categoryCourseCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.categoryCourseCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async courseCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.courseCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async invoiceCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.invoiceCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async categoryEnrolledCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.categoryEnrolledCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async categoryMoneyCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.categoryMoneyCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyCalculation(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyCalculation(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async userCount(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.userCount(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async ratingPercent(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.ratingPercent(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyByMonth(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyByMonth(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
