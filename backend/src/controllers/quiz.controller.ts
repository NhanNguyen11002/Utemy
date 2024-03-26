import services from "../services";
import { ResponseBase } from "../common";
import { Response } from "express";
import { IRequestWithId } from "../types/request";

export default class QuizController {
    async createQuizGroup(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.createQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateQuizGroup(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.updateQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteQuizGroup(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.deleteQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizGroup(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.getAllQuizGroup(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizGroupHasQuiz(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.getAllQuizGroupHasQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async createQuiz(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.createQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async updateQuiz(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.updateQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteQuiz(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.deleteQuiz(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllQuizByGroupId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.QuizServices.getAllQuizByGroupId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
