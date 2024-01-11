import express, { Request, Response, response } from "express";
import { IRequestWithId } from "../types/request";
import userSchema from "../validations/user.validation";
import { ValidationError } from "joi";
import { ResponseBase, convertJoiErrorToString } from "../common";
import SectionService from "../services/section.services";
import sectionSchema, { SectionSchema } from "../validations/section.validation";

export default class SectionController {
    async addSection(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = sectionSchema.SectionSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await SectionService.addSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async editSection(req: IRequestWithId, res: Response): Promise<Response> {
        const errorValidate: ValidationError | undefined = sectionSchema.UpdateSectionSchema.validate(req.body).error;

        if (errorValidate) {
            console.log(errorValidate);
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }
        const response: ResponseBase = await SectionService.editSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async deleteSection(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await SectionService.deleteSection(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllSectionByCourseId(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await SectionService.getAllSectionByCourseId(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
