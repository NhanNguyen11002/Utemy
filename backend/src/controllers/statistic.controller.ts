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
    async courseCountByOwnerCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.courseCountByOwnerCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop5EnrolledCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.getTop5EnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop5RateCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.getTop5RateCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyCalculationByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyCalculationByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyByMonthByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyByMonthByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyByCourseByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyByCourseByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async userEnrolledCountByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.userEnrolledCountByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async studentsRegisteredByTime(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.studentsRegisteredByTime(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async studentsRegisteredByYear(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.studentsRegisteredByYear(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneySaleCourseCalculationByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneySaleCourseCalculationByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async moneyOriginCourseByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.moneyOriginCourseByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async totalPassOrUnpassCourseOfOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.totalPassOrUnpassCourseOfOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async avgRateAllCoursesByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.avgRateAllCoursesByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async ratingPercentByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.ratingPercentByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async totalTurnRatingByOwner(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.totalTurnRatingByOwner(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statCourseForAdminByEnrolled(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statCourseForAdminByEnrolled(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statCourseForAdminByAvgRating(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statCourseForAdminByAvgRating(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statCourseForAdminByIncome(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statCourseForAdminByIncome(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statCourseForAdminByReport(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statCourseForAdminByReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statLecturerForAdminByEnrolled(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statLecturerForAdminByEnrolled(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statLecturerForAdminByAvgAvgRating(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statLecturerForAdminByAvgAvgRating(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statLecturerForAdminByIncome(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statLecturerForAdminByIncome(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async statLecturerForAdminByReport(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.StatisticServices.statLecturerForAdminByReport(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
