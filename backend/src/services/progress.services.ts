import { ResponseSuccess, ResponseError, ResponseBase } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import { Request } from "express";
import helper from "../helper";
import constants from "../constants";

const updateProgress = async (req: IRequestWithId): Promise<ResponseBase> => {
    //chỉ dùng để update tiến độ cho bài học dạng video, dạng test đã xử lý riêng bên test
    const lectureId = Number(req.body.lecture_id);
    const progressValue = Number(req.body.progress_value);
    const userId = Number(req.user_id);
    const isLectureExist = await configs.db.lecture.findFirst({
        where: {
            id: lectureId,
            type: "Lesson",
        },
        include: {
            section: true,
            lesson: true,
        },
    });
    if (!isLectureExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
    const courseId = isLectureExist.section.course_id;
    const isProgressExist = await configs.db.progress.findFirst({
        where: {
            user_id: userId,
            course_id: courseId,
            lecture_id: lectureId,
        },
    });
    const progressPercent = progressValue / Number(isLectureExist.lesson?.duration);
    const isPass = progressPercent >= 0.85;
    if (isProgressExist) {
        if (!isProgressExist.pass) {
            const updateProgress = await configs.db.progress.update({
                where: {
                    id: isProgressExist.id,
                },
                data: {
                    progress_value: progressValue,
                    progress_percent: progressPercent,
                    pass: isPass,
                },
            });
            if (isPass) updateOverallProgress(userId, courseId);
            if (updateProgress) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, { isPass });
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        } else return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } else {
        const createProgress = await configs.db.progress.create({
            data: {
                user_id: userId,
                course_id: courseId,
                lecture_id: lectureId,
                progress_value: progressValue,
                progress_percent: progressPercent,
                pass: isPass,
            },
        });
        if (isPass) updateOverallProgress(userId, courseId);
        if (createProgress) {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, { isPass });
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    }
};
const updateOverallProgress = async (userId: number, courseId: number) => {
    const findEnrolled = await configs.db.enrolled.findFirst({
        where: {
            user_id: userId,
            course_id: courseId,
        },
        select: {
            id: true,
        },
    });
    const updateOverallProgress = await configs.db.enrolled.update({
        where: {
            id: findEnrolled?.id,
        },
        data: {
            overall_progress: {
                increment: 1,
            },
        },
    });
};

const ProgressServices = {
    updateProgress,
};
export default ProgressServices;
