import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";

export const uploadAvatar = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadAvatar(req, res, (error: any) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
export const uploadCategory = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadCategory(req, res, (error: any) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
export const uploadThumbnail = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadThumbnail(req, res, (error: any) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
export const uploadVideo = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadVideo(req, res, (error: any) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
