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
            is_delete: false,
        },
    });
    const progressPercent = progressValue / Number(isLectureExist.lesson?.duration);
    const isPass = progressPercent >= 0.85;

    if (isProgressExist) {
        if (isProgressExist.progress_value > progressValue)
            return new ResponseSuccess(200, constants.success.SUCCESS_BUT_NO_UPDATE_PROGRESS, true);
        const data = {
            progress_value: progressValue,
            progress_percent: progressPercent,
        };
        if (!isProgressExist.pass) {
            const updateProgress = await configs.db.progress.update({
                where: {
                    id: isProgressExist.id,
                },
                data: {
                    ...data,
                    pass: isPass,
                },
            });
            if (updateProgress) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, {
                    lecture_id: isProgressExist.lecture_id,
                    progress_percent: progressPercent,
                    progress_value: progressValue,
                    is_pass: isPass,
                });
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        } else {
            const updateProgress = await configs.db.progress.update({
                where: {
                    id: isProgressExist.id,
                },
                data: {
                    ...data,
                },
            });
            if (updateProgress) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, {
                    lecture_id: isProgressExist.lecture_id,
                    progress_percent: progressPercent,
                    progress_value: progressValue,
                });
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
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
        if (createProgress) {
            const getProgress = await configs.db.progress.findFirst({
                where: {
                    id: createProgress.id,
                },
                include: {
                    lecture: {
                        select: {
                            section_id: true,
                            lesson: true,
                            test: true,
                            type: true,
                        },
                    },
                },
            });
            if (!getProgress) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            const duration =
                getProgress.lecture.type === "Lesson"
                    ? getProgress.lecture.lesson?.duration
                    : getProgress.lecture.test?.duration;
            const temp = {
                progress_id: getProgress.id,
                lecture_id: getProgress.lecture_id,
                section_id: getProgress.lecture.section_id,
                is_pass: getProgress.pass,
                duration,
                progress_value: getProgress.progress_value,
                progress_percent: getProgress.progress_percent,
            };
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, temp);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    }
};

const ProgressServices = {
    updateProgress,
};
export default ProgressServices;
