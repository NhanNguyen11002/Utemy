import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { Response, NextFunction } from "express";
import { MulterError } from "multer";
import helper from "../helper";
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
export const uploadImageBlog = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadImageBlog(req, res, (error: any) => {
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
export const uploadEvidence = async (req: IRequestWithId, res: Response) => {
    configs.upload.uploadEvidence(req, res, (error: any) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        const file = req.file;
        if (file) {
            const convertFilePath = helper.ConvertHelper.convertFilePath(file.path);
            res.status(200).json({ message: "Upload success", success: true, status_code: 200, data: convertFilePath });
            return;
        }
        res.status(400).json({ message: error.message, success: false, status_code: 400 });
        return;
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
export const uploadTrailer = async (req: IRequestWithId, res: Response, next: NextFunction) => {
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
export const uploadMixFiles = async (req: IRequestWithId, res: Response, next: NextFunction) => {
    configs.upload.uploadMixFile(req, res, (error: any) => {
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
