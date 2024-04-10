import services from "../services";
import { ResponseBase } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";

export default class ReportController {
    async createReport(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReportServices.createReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getReportByCourseId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReportServices.getReportByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllReportWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReportServices.getAllReportWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async handleReport(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.ReportServices.handleReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
