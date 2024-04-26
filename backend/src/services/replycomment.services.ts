import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DateTime } from "luxon";

const createReplyComment = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { content, comment_id } = req.body;
        const isCommentExist = await configs.db.commentLecture.findFirst({
            where: {
                id: comment_id,
            },
        });
        if (isCommentExist) {
            const createdReply = await configs.db.replyCommentLecture.create({
                data: {
                    content,
                    user_id: user_id,
                    comment_id: comment_id,
                },
                // include: {
                //     user: true,
                //     replyCommentLectures: true,
                // },
            });
            if (createdReply)
                return new ResponseSuccess(
                    200,
                    constants.success.SUCCESS_CREATE_REPLY_COMMENT_LECTURE,
                    true,
                    createdReply,
                );
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(404, constants.error.ERROR_COMMENT_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateReplyComment = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { reply_id } = req.params;
        const { content } = req.body;
        const isReplyExist = await configs.db.replyCommentLecture.findFirst({
            where: {
                id: Number(reply_id),
                user_id: user_id,
            },
        });
        if (isReplyExist) {
            const updatedReply = await configs.db.replyCommentLecture.update({
                where: {
                    id: Number(reply_id),
                },
                data: {
                    content: content,
                    updatedAt: new Date(),
                },
            });
            if (updatedReply)
                return new ResponseSuccess(
                    200,
                    constants.success.SUCCESS_UPDATE_REPLY_COMMENT_LECTURE,
                    true,
                    updatedReply,
                );
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(404, constants.error.ERROR_REPLY_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteReplyComment = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { reply_id } = req.params;
        const isReplyExist = await configs.db.replyCommentLecture.findFirst({
            where: {
                id: Number(reply_id),
                user_id: user_id,
            },
        });
        if (isReplyExist) {
            const deletedReply = await configs.db.replyCommentLecture.delete({
                where: {
                    id: Number(reply_id),
                },
            });
            if (deletedReply) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_REPLY_COMMENT_LECTURE, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(404, constants.error.ERROR_REPLY_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getReplyCommentsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_COMMENT_LECTURE, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const replyCommentService = {
    createReplyComment,
    updateReplyComment,
    deleteReplyComment,
    getReplyCommentsWithPagination,
};
export default replyCommentService;