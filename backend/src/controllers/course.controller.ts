import express, { Request, Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
import courseSchema, { createCourseSchema } from "../validations/course.validation";
import { ValidationError } from "joi";
import { ResponseBase, convertJoiErrorToString } from "../common";
export default class CourseController {
    async getRightOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getRightOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async createCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = courseSchema.createCourseSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        // const trailerFile: Express.Multer.File | undefined = req.file;
        const response: ResponseBase = await services.CourseService.createCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async editCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = courseSchema.updateCourseSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CourseService.editCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateTargetCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.updateTargetCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.deleteCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getListRatingOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getListRatingOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getRatingPercentOfCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getRatingPercentOfCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getTop10RateCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getTop10RateCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10EnrolledCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getTop10EnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async searchMyCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.searchMyCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async searchMyEnrolledCourse(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.searchMyEnrolledCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getAllCourse(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getAllCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async changeThumbnail(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.changeThumbnail(req);
        return res.status(response.getStatusCode()).json(response);
    }

    async getCourseDetail(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getCourseDetail(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getProgressByCourseSlug(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getProgressByCourseSlug(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCourseDetailForTrialLesson(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getCourseDetailForTrialLesson(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getCourseDetailById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getCourseDetailById(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async addPromotion(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = courseSchema.addPromotionSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.CourseService.addPromotion(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async stopPromotion(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.stopPromotion(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllSalesCourses(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getAllSalesCourses(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getTop10SalesCourses(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.getTop10SalesCourses(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async approveCourse(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.approveCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async restrictCourse(req: Request, res: Response): Promise<Response> {
        const response: ResponseBase = await services.CourseService.restrictCourse(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
