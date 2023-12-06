import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import lessonRouter from "~/routes/lesson.router";
import helper from "../helper";

const addSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id, title } = req.body;
        const isDeletedCourse = await configs.db.course.findFirst({
            where: {
                is_delete: true,
                id: course_id,
            },
        });
        if (isDeletedCourse) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        const addsection = await configs.db.section.create({
            data: {
                title: title,
                course_id: course_id,
            },
        });
        if (addsection) return new ResponseSuccess(201, constants.success.SUCCESS_REQUEST, true);
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const editSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { title, section_id } = req.body;

        const isAuthor = await configs.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: Number(section_id),
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isAuthor) {
            return new ResponseError(403, constants.error.ERROR_UNAUTHORIZED, false);
        }
        if (isAuthor.Course?.is_delete) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isAuthor.is_delete) {
            return new ResponseError(404, constants.error.ERROR_SECTION_NOT_FOUND, false);
        }
        const editsection = await configs.db.section.update({
            where: {
                id: Number(section_id),
            },
            data: {
                title: title,
            },
        });
        if (editsection) return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true);
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const deleteSection = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { section_id } = req.params;
        const isFoundSection = await configs.db.section.findFirst({
            include: {
                Course: true,
            },
            where: {
                id: Number(section_id),
                Course: {
                    author_id: req.user_id,
                },
            },
        });
        if (!isFoundSection) {
            return new ResponseError(403, constants.error.ERROR_SECTION_NOT_FOUND, false);
        }
        if (isFoundSection.Course?.is_delete) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        if (isFoundSection.is_delete) {
            return new ResponseError(404, constants.error.ERROR_SECTION_NOT_FOUND, false);
        }

        const isDelete = await configs.db.section.update({
            where: {
                id: Number(section_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) {
            const isDeleteLesson = await configs.db.lesson.updateMany({
                where: {
                    section_id: Number(section_id),
                },
                data: {
                    is_delete: true,
                },
            });
            if (isDeleteLesson) {
                const deletedLesson = await configs.db.lesson.findMany({
                    where: {
                        section_id: Number(section_id),
                        is_delete: true,
                    },
                });
                deletedLesson.forEach(async (lesson) => {
                    const fullPathDeConverted = await helper.ConvertHelper.deConvertFilePath(lesson.url_video);
                    await helper.FileHelper.destroyedVideoIfFailed(fullPathDeConverted);
                });
                return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true);
            }
        }
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllSectionByCourseId = async (req: Request): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const isFoundSection = await configs.db.section.findMany({
            where: {
                course_id: parseInt(course_id),
                is_delete: false,
                Course: {
                    is_delete: false,
                },
            },
            include: {
                Lesson: {
                    where: {
                        is_delete: false,
                    },
                    select: {
                        title: true,
                        id: true,
                        url_video: true,
                        updated_at: true,
                        duration: true,
                        description: true,
                    },
                },
                Course: true,
            },
        });
        if (isFoundSection) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isFoundSection);
        return new ResponseError(400, constants.error.ERROR_VALIDATION_FAILED, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const SectionService = {
    addSection,
    editSection,
    deleteSection,
    getAllSectionByCourseId,
};

export default SectionService;
