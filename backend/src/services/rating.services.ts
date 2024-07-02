import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { generateUniqueSlug } from "../utils/helper";
import { Prisma } from "@prisma/client";
import constants from "../constants";
import helper from "../helper";
import { Rating } from "../types/rating.type";
import {
    CourseDetail,
    Category,
    CourseEdit,
    OutstandingCourse,
    CourseInfo,
    CourseCard,
    CourseOrderByWithRelationInput,
} from "../types/course";
import { PagingResponse } from "../types/response";
import { title } from "process";
import { Section } from "../types/section";
const ratingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { score, content, course_id } = req.body;
        const user_id = req.user_id as number;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isFoundCourse) return new ResponseError(401, constants.error.ERROR_COURSE_NOT_FOUND, false);
        const courseId = isFoundCourse.id;
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: courseId,
                user_id,
            },
        });
        if (!isEnrolled) {
            return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
        } else {
            const isAlreadyRating = await configs.db.rating.findFirst({
                where: {
                    user_id,
                    course_id: courseId,
                },
            });
            if (isAlreadyRating) {
                return new ResponseError(400, constants.error.ERROR_ALREADY_RATING, false);
            }
            const ratingCourse = await configs.db.rating.create({
                data: {
                    user_id,
                    course_id,
                    score,
                    content,
                },
            });
            const ratingListOfCourse = await configs.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                        number_of_rating: isFoundCourse.number_of_rating + 1,
                    },
                });
                if (updateRatingCourse) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_RATING, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }

        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editRatingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { rating_id, content, score } = req.body;
        const user_id = req.user_id;
        const isRatingExist = await configs.db.rating.findFirst({
            where: {
                id: rating_id,
            },
        });
        if (!isRatingExist) {
            return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
        } else {
            if (isRatingExist.user_id !== user_id) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            }
            const course_id = isRatingExist.course_id;
            const updateRatingCourse = await configs.db.rating.update({
                where: {
                    id: rating_id,
                },
                data: {
                    content,
                    score,
                },
            });
            const ratingListOfCourse = await configs.db.rating.findMany({
                where: {
                    course_id,
                },
            });
            if (ratingListOfCourse.length > 0) {
                const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                    return sum + rating.score;
                }, 0);
                const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                const updateRatingCourse = await configs.db.course.update({
                    where: {
                        id: course_id,
                    },
                    data: {
                        average_rating,
                    },
                });
                if (updateRatingCourse) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteRatingCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { rating_id } = req.params;
        const user_id = req.user_id;
        const isRatingExist = await configs.db.rating.findFirst({
            where: {
                id: Number(rating_id),
            },
        });
        if (!isRatingExist) return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
        else if (isRatingExist.user_id !== user_id)
            return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
        else {
            const isFoundCourse = await configs.db.course.findFirst({
                where: {
                    id: isRatingExist.course_id,
                },
            });
            if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            else {
                const course_id = isFoundCourse.id;
                const deleteRating = await configs.db.rating.delete({
                    where: {
                        id: Number(rating_id),
                    },
                });
                const ratingListOfCourse = await configs.db.rating.findMany({
                    where: {
                        course_id,
                    },
                });
                if (ratingListOfCourse.length > 0) {
                    const ratingSum = ratingListOfCourse.reduce((sum, rating) => {
                        return sum + rating.score;
                    }, 0);
                    const average_rating = Number((ratingSum / ratingListOfCourse.length).toFixed(1));
                    const updateRatingCourse = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating,
                            number_of_rating: isFoundCourse.number_of_rating - 1,
                        },
                    });
                    if (updateRatingCourse) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                } else {
                    const updateRatingCourse = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            average_rating: 0,
                            number_of_rating: 0,
                        },
                    });
                    if (updateRatingCourse) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getUserRatingOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.params;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const ratingOfUser = await configs.db.rating.findFirst({
                where: {
                    user_id,
                    course_id: Number(course_id),
                },
                include: {
                    User: {
                        select: {
                            url_avatar: true,
                            first_name: true,
                            last_name: true,
                            id: true,
                        },
                    },
                },
            });
            if (!ratingOfUser) return new ResponseError(404, constants.error.ERROR_RATING_NOT_FOUND, false);
            const ratingOfUserResponse: Rating = {
                id: ratingOfUser.id,
                user_id: ratingOfUser.user_id,
                first_name: ratingOfUser.User.first_name,
                last_name: ratingOfUser.User.last_name,
                url_avatar: ratingOfUser.User.url_avatar,
                score: ratingOfUser.score,
                content: ratingOfUser.content,
                created_at: ratingOfUser.created_at.toString(),
            };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, ratingOfUserResponse);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingServices = {
    ratingCourse,
    editRatingCourse,
    deleteRatingCourse,
    getUserRatingOfCourse,
};
export default ratingServices;
