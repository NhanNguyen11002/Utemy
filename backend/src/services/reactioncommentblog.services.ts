import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { EnumReactionType } from "~/types/reactionblog.type";

const createReactionCommentBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { commentblog_id, type } = req.body;

        // Kiểm tra sự tồn tại của comment
        const isCommentExist = await configs.db.commentBlog.findFirst({
            where: {
                id: commentblog_id,
            },
        });

        if (!isCommentExist) {
            return new ResponseError(400, constants.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }

        // Kiểm tra sự tồn tại của phản ứng
        const existingReaction = await configs.db.reactionCommentBlog.findFirst({
            where: {
                user_id: user_id,
                comment_id: commentblog_id,
            },
        });

        if (existingReaction) {
            if (existingReaction.type == type) {
                const deletedReaction = await configs.db.reactionCommentBlog.delete({
                    where: {
                        id: existingReaction.id,
                    },
                });
                if (deletedReaction) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                // Nếu phản ứng đã tồn tại, cập nhật loại phản ứng thành dislike
                const updatedReaction = await configs.db.reactionCommentBlog.update({
                    where: {
                        id: existingReaction.id,
                    },
                    data: {
                        type: type,
                    },
                });

                if (updatedReaction) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        } else {
            // Nếu phản ứng chưa tồn tại, tạo mới phản ứng với loại dislike
            const newReaction = await configs.db.reactionCommentBlog.create({
                data: {
                    user_id: Number(user_id),
                    comment_id: commentblog_id,
                    type: type,
                },
                include: {
                    comment_blog: true,
                },
            });

            if (newReaction) {
                return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_REACTION, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const deleteReactionCommentBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { reaction_id } = req.params;
        const user_id = Number(req.user_id);
        const existingReaction = await configs.db.reactionCommentBlog.findFirst({
            where: {
                id: Number(reaction_id),
                user_id: user_id,
            },
        });

        if (!existingReaction) {
            return new ResponseError(400, "Reaction does not exist", false);
        }

        await configs.db.reactionCommentBlog.delete({
            where: {
                id: existingReaction.id,
            },
        });

        return new ResponseSuccess(200, "Reaction deleted successfully", true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTotalReactionsByCommentId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const {comment_id} = req.params;
        const isCommentExist = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(comment_id),
            },
        });

        if (!isCommentExist) {
            return new ResponseError(400, constants.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }
        // Tính tổng số like
        const totalLikes = await configs.db.reactionCommentBlog.count({
            where: {
                comment_id: Number(comment_id),
                type: "LIKE", // Đếm số lượng phản ứng có loại là LIKE
            },
        });

        // Tính tổng số dislike
        const totalDislikes = await configs.db.reactionCommentBlog.count({
            where: {
                comment_id: Number(comment_id),
                type: "DISLIKE", // Đếm số lượng phản ứng có loại là DISLIKE
            },
        });

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { totalLikes, totalDislikes });
    } catch (error) {
        console.error("Error:", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTotalReactionsForAllComments = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const allComments = await configs.db.commentBlog.findMany();

        const reactionsForAllComments: any[] = [];

        for (const comment of allComments) {
            const totalLikes = await configs.db.reactionCommentBlog.count({
                where: {
                    comment_id: comment.id,
                    type: "LIKE",
                },
            });

            const totalDislikes = await configs.db.reactionCommentBlog.count({
                where: {
                    comment_id: comment.id,
                    type: "DISLIKE",
                },
            });

            reactionsForAllComments.push({
                comment_id: comment.id,
                totalLikes,
                totalDislikes,
            });
        }

        // Trả về kết quả
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, reactionsForAllComments);
    } catch (error) {
        console.error("Error:", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};


const reactionCommentBlogService = {
    createReactionCommentBlog,
    deleteReactionCommentBlog,
    getTotalReactionsByCommentId,
    getTotalReactionsForAllComments
};
export default reactionCommentBlogService;
