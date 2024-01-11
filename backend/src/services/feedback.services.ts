import { IRequestWithId } from "~/types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { FeedbackResponse } from "../types/feedback.type";

const createFeedback = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { content, score } = req.body;
        const user_id = req.user_id;
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const createFeedback = await configs.db.feedback.create({
            data: {
                content,
                user_id,
                score,
            },
        });
        if (!createFeedback) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_FEEDBACK, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAllFeedbacks = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const { page_index: pageIndex, evaluate } = req.query;
        const convertedEvaluate: number | undefined = evaluate ? parseFloat(evaluate as string) : undefined;
        const pageSize = configs.general.PAGE_SIZE;
        const baseFilter: any = {};
        if (convertedEvaluate) {
            baseFilter.score = convertedEvaluate;
        }
        const totalRecord = await configs.db.feedback.count({
            where: baseFilter,
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const getAllFeedbacks = await configs.db.feedback.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        url_avatar: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            where: baseFilter,
        });
        const averageRating = await configs.db.feedback.aggregate({
            _avg: {
                score: true,
            },
        });
        const getFeedbacksList: FeedbackResponse[] = [];
        getAllFeedbacks.map((item) => {
            const feedback: FeedbackResponse = {
                feedback_id: item.id,
                content: item.content,
                user_id: item.user.id,
                first_name: item.user.first_name,
                last_name: item.user.last_name,
                url_avatar: item.user.url_avatar,
                created_at: item.created_at.toString(),
                score: item.score,
            };
            return getFeedbacksList.push(feedback);
        });
        const getFeedbacksResponse = {
            total_record: totalRecord,
            total_page: totalPage,
            average_rating: averageRating._avg.score,
            data: getFeedbacksList,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getFeedbacksResponse);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }

        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const FeedbackServices = {
    createFeedback,
    getAllFeedbacks,
};
export default FeedbackServices;
