import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DateTime } from "luxon";
import { CommentBlogResponse, ReplyBlogResponse } from "~/types/commentblog.type";
import { ReactionType } from "~/types/reactionblog.type";

const createCommentBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { content, blog_id, parent_id } = req.body;

        const isBlogExist = await configs.db.blog.findFirst({ where: { id: blog_id } });
        if (!isBlogExist) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);

        if (parent_id) {
            const isCommentExist = await configs.db.commentBlog.findFirst({
                where: { id: parent_id, blog_id: blog_id },
            });
            if (!isCommentExist) return new ResponseError(400, constants.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
        }

        const createdCommentBlog = await configs.db.commentBlog.create({
            data: {
                content,
                user_id,
                blog_id,
                parent_id,
            },
            // include: {
            //     user: true,
            //     replyCommentLectures: true,
            // },
        });

        if (createdCommentBlog) {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_COMMENT_BLOG, true, createdCommentBlog);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const updateCommentBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { commentblog_id } = req.params;
        const { content } = req.body;
        const isCommentBlogExist = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(commentblog_id),
                user_id: user_id,
            },
        });
        if (isCommentBlogExist) {
            const updatedCommentBlog = await configs.db.commentBlog.update({
                where: {
                    id: Number(commentblog_id),
                },
                data: {
                    content: content,
                    updated_at: new Date(),
                },
            });
            if (updatedCommentBlog)
                return new ResponseSuccess(
                    200,
                    constants.success.SUCCESS_UPDATE_COMMENT_BLOG,
                    true,
                    updatedCommentBlog,
                );
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(404, constants.error.ERROR_COMMENT_BLOG_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCommentBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { commentblog_id } = req.params;
        const isCommentBlogExist = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(commentblog_id),
                user_id: user_id,
            },
        });
        if (isCommentBlogExist) {
            const deletedCommentBlog = await configs.db.commentBlog.delete({
                where: {
                    id: Number(commentblog_id),
                },
            });
            if (deletedCommentBlog)
                return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_COMMENT_BLOG, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, deletedCommentBlog);
        } else return new ResponseError(404, constants.error.ERROR_COMMENT_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentBlogsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const parsedSearchItem = searchItem as string;
        const pageSize = configs.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllCommentBlog = await configs.db.commentBlog.findMany({
            skip,
            take: pageSize,
            where: {
                content: {
                    contains: parsedSearchItem,
                },
                parent_id: null,
            },
            orderBy: {
                updated_at: "desc",
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                reactions: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllCommentBlog) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs.db.commentBlog.count({
            where: {
                parent_id: null,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments: CommentBlogResponse[] = [];
        getAllCommentBlog.map((item) => {
            const comment: CommentBlogResponse = {
                commentblog_id: item.id,
                content: item.content,
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                blog_id: item.blog_id,
                replies: (item.replies as any).map((r: ReplyBlogResponse) => {
                    return {
                        replyblog_id: r.id,
                        content: r.content,
                        updated_at: r.updated_at,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        blog_id: r.blog_id,
                        reactions: (r.reactions as any).map((reaction: ReactionType) => {
                            return {
                                reaction_id: reaction.id,
                                user: {
                                    user_id: reaction.user.id,
                                    first_name: reaction.user.first_name,
                                    last_name: reaction.user.last_name,
                                    url_avatar: reaction.user.url_avatar,
                                },
                                commentblog_id: reaction.commentblog_id,
                                type: reaction.type,
                                updated_at: reaction.updated_at,
                            };
                        }),
                    };
                }),
                reactions: (item.reactions as any).map((reaction: ReactionType) => {
                    return {
                        reaction_id: reaction.id,
                        user: {
                            user_id: reaction.user.id,
                            first_name: reaction.user.first_name,
                            last_name: reaction.user.last_name,
                            url_avatar: reaction.user.url_avatar,
                        },
                        commentblog_id: reaction.commentblog_id,
                        type: reaction.type,
                        updated_at: reaction.updated_at,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentBlogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, commentBlogsResponseData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCommentBlogsWithPaginationByBlogId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { blog_id } = req.params;
        const { page_index: pageIndex } = req.query;
        // const parsedSearchItem = searchItem as string;
        const pageSize = configs.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllCommentByBlogId = await configs.db.commentBlog.findMany({
            skip,
            take: pageSize,
            where: {
                blog_id: Number(blog_id),
                parent_id: null,
            },
            orderBy: {
                updated_at: "desc",
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
                reactions: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!getAllCommentByBlogId) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs.db.commentBlog.count({
            where: {
                parent_id: null,
                blog_id: Number(blog_id),
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const comments: CommentBlogResponse[] = [];
        getAllCommentByBlogId.map((item) => {
            const comment: CommentBlogResponse = {
                commentblog_id: item.id,
                content: item.content,
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                user: {
                    id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                    url_avatar: item.user.url_avatar || undefined,
                },
                blog_id: item.blog_id,
                replies: (item.replies as any).map((r: ReplyBlogResponse) => {
                    return {
                        replyblog_id: r.id,
                        content: r.content,
                        updated_at: r.updated_at,
                        user: {
                            user_id: r.user.id,
                            first_name: r.user.first_name,
                            last_name: r.user.last_name,
                            url_avatar: r.user.url_avatar,
                        },
                        blog_id: r.blog_id,
                        reactions: (r.reactions as any).map((reaction: ReactionType) => {
                            return {
                                reaction_id: reaction.id,
                                user: {
                                    user_id: reaction.user.id,
                                    first_name: reaction.user.first_name,
                                    last_name: reaction.user.last_name,
                                    url_avatar: reaction.user.url_avatar,
                                },
                                commentblog_id: reaction.commentblog_id,
                                type: reaction.type,
                                updated_at: reaction.updated_at,
                            };
                        }),
                    };
                }),
                reactions: (item.reactions as any).map((reaction: ReactionType) => {
                    return {
                        reaction_id: reaction.id,
                        user: {
                            user_id: reaction.user.id,
                            first_name: reaction.user.first_name,
                            last_name: reaction.user.last_name,
                            url_avatar: reaction.user.url_avatar,
                        },
                        commentblog_id: reaction.commentblog_id,
                        type: reaction.type,
                        updated_at: reaction.updated_at,
                    };
                }),
            };
            return comments.push(comment);
        });
        const commentBlogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: comments,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, commentBlogsResponseData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log("Error:", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const commentBlogService = {
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogsWithPagination,
    getCommentBlogsWithPaginationByBlogId,
};
export default commentBlogService;
