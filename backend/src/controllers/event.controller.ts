import { ResponseBase } from "../common/response";
import { Response } from "express";
import services from "../services";
import { IRequestWithId } from "../types/request";
import multer from "multer";
const upload = multer();
export default class EventController {
    async createEvent(req: IRequestWithId, res: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData: FormData = req.body;
                    const response: ResponseBase = await services.EventServices.createEvent(req, formData);

                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }

    async updateEvent(req: IRequestWithId, res: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            try {
                // Dùng middleware multer để xử lý FormData
                upload.none()(req, res, async (err) => {
                    if (err) {
                        console.error("Error occurred while parsing FormData:", err);
                        return res.status(400).json({ error: "Bad Request" });
                    }
                    const formData: FormData = req.body;
                    const response: ResponseBase = await services.EventServices.updateEvent(req, formData);

                    // Gửi phản hồi thành công sau khi xử lý FormData
                    return res.status(response.getStatusCode()).json(response);
                });
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error("An error occurred while creating coupon:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    async deleteEvent(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.EventServices.deleteEvent(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getEventsWithPagination(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.EventServices.getEventsWithPagination(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getAllEvents(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.EventServices.getAllEvents(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getEventById(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.EventServices.getEventById(req);
        return res.status(response.getStatusCode()).json(response);
    }
    async getActiveEvent(req: IRequestWithId, res: Response): Promise<Response> {
        const response: ResponseBase = await services.EventServices.getActiveEvent(req);
        return res.status(response.getStatusCode()).json(response);
    }
}
