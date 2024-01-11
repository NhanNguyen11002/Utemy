import services from "../services";
import { ResponseBase, convertJoiErrorToString } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";
import { ValidationError } from "joi";
import feedbackSchema from "../validations/feedback.validator";

export default class FeedbackController {
    async createFeedback(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = feedbackSchema.createFeedbackSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await services.FeedbackServices.createFeedback(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllFeedbacks(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.FeedbackServices.getAllFeedbacks(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
