import { ResponseSuccess, ResponseError, ResponseBase, resolutions } from "../common";
import configs from "../configs";
import { IRequestWithId } from "../types/request";
import constants from "../constants";
import { v4 as uuidv4 } from "uuid";
import helper from "../helper";
import { CreateLessonType } from "../types/lesson";
const createLesson = async (content: CreateLessonType, lectureId: number): Promise<ResponseBase> => {
    try {
        const videoFile = content.videoFile;
        const title = content.title;
        const description = content.description;
        const uuid = uuidv4();
        const createFile = await helper.FileHelper.createFileM3U8AndTS(
            videoFile as Express.Multer.File,
            resolutions,
            configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
            `${lectureId}_${uuid}`,
        );
        const fullpathConverted = helper.ConvertHelper.convertFilePath(createFile.urlVideo);
        const createLesson = await configs.db.lesson.create({
            data: {
                title,
                lecture_id: lectureId,
                url_video: fullpathConverted,
                duration: Math.ceil(createFile.duration).toString(),
                description,
            },
        });
        if (!createLesson) {
            await helper.FileHelper.destroyedVideoIfFailed(createFile.urlVideo);
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_LESSON, true);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const updateLesson = async (content: CreateLessonType, lectureId: number): Promise<ResponseBase> => {
    try {
        const title = content.title;
        const videoFile = content.videoFile;
        const description = content.description;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isFoundLesson) return new ResponseError(404, constants.error.ERROR_LESSON_NOT_FOUND, false);
        if (videoFile) {
            const uuid = uuidv4();
            const createFile = await helper.FileHelper.createFileM3U8AndTS(
                videoFile as Express.Multer.File,
                resolutions,
                configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                `${lectureId}_${uuid}`,
            );
            const fullPathConverted = helper.ConvertHelper.convertFilePath(createFile.urlVideo);
            const oldFullPathConverted = helper.ConvertHelper.deConvertFilePath(isFoundLesson.url_video);
            const updateLesson = await configs.db.lesson.update({
                where: {
                    lecture_id: lectureId,
                },
                data: {
                    title,
                    url_video: fullPathConverted,
                    duration: Math.ceil(createFile.duration).toString(),
                    description,
                },
            });
            if (updateLesson) {
                await helper.FileHelper.destroyedVideoIfFailed(oldFullPathConverted);
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_LESSON, true);
            } else {
                await helper.FileHelper.destroyedVideoIfFailed(createFile.urlVideo);
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        } else {
            const updateLesson = await configs.db.lesson.update({
                where: {
                    lecture_id: lectureId,
                },
                data: {
                    title,
                    description,
                },
            });
            if (updateLesson) {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_LESSON, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const deleteLesson = async (lectureId: number): Promise<ResponseBase> => {
    try {
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                lecture_id: lectureId,
            },
        });
        if (!isFoundLesson) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        else {
            if (isFoundLesson.is_delete) return new ResponseError(400, constants.error.ERROR_LESSON_NOT_FOUND, false);
            else {
                const deleteLesson = await configs.db.lesson.update({
                    where: { lecture_id: lectureId },
                    data: {
                        is_delete: true,
                        lecture_id: null,
                    },
                });
                if (deleteLesson) {
                    helper.FileHelper.destroyedVideoIfFailed(
                        helper.ConvertHelper.deConvertFilePath(deleteLesson.url_video),
                    );
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_LESSON, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, JSON.stringify(error), false);
    }
};

const LessonServices = {
    createLesson,
    updateLesson,
    deleteLesson,
};
export default LessonServices;
