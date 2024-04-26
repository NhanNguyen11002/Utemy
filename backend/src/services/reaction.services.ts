import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DateTime } from "luxon";
import { LikeResponse } from "~/types/like.type";
import { DislikeResponse } from "~/types/dislike.type";
import { error } from "console";

const createLike = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistLike = await configs.db.like.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (!isExistLike) {
            const newLike = await configs.db.like.create({
                data: {
                    user_id: Number(user_id),
                    comment_id,
                    reply_id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (newLike.reply_id == null) {
                const updateCommentLikeCounts = await configs.db.commentLecture.update({
                    where: {
                        id: newLike.comment_id,
                    },
                    data: {
                        likes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (updateCommentLikeCounts) {
                    const findDislike = await configs.db.dislike.findFirst({
                        where: {
                            user_id: newLike.user_id,
                            comment_id: newLike.comment_id,
                            reply_id: null,
                        },
                    });
                    if (findDislike) {
                        const deleteDislike = await configs.db.dislike.delete({
                            where: {
                                id: findDislike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: null,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteDislike) {
                            const reduceAmountDislike = await configs.db.commentLecture.update({
                                where: {
                                    id: deleteDislike.comment_id,
                                },
                                data: {
                                    dislikes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    disliked_by: true,
                                },
                            });
                            if (reduceAmountDislike)
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_LIKE,
                                    true,
                                    updateCommentLikeCounts,
                                );
                            else
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_LIKE,
                                    true,
                                    updateCommentLikeCounts,
                                );
                        } else
                            return new ResponseSuccess(
                                200,
                                constants.success.SUCCESS_CREATE_LIKE,
                                true,
                                updateCommentLikeCounts,
                            );
                    } else
                        return new ResponseSuccess(
                            200,
                            constants.success.SUCCESS_CREATE_LIKE,
                            true,
                            updateCommentLikeCounts,
                        );
                }
                return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            } else if (newLike.reply_id != null) {
                const updateReplyLikeCounts = await configs.db.replyCommentLecture.update({
                    where: {
                        id: newLike.reply_id,
                    },
                    data: {
                        likes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (updateReplyLikeCounts) {
                    const findDislike = await configs.db.dislike.findFirst({
                        where: {
                            user_id: newLike.user_id,
                            comment_id: newLike.comment_id,
                            reply_id: newLike.reply_id,
                        },
                    });
                    if (findDislike) {
                        const deleteDislike = await configs.db.dislike.delete({
                            where: {
                                id: findDislike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: findLike.reply_id,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteDislike) {
                            const reduceAmountDislike = await configs.db.replyCommentLecture.update({
                                where: {
                                    id: deleteDislike.reply_id || undefined,
                                },
                                data: {
                                    dislikes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    disliked_by: true,
                                },
                            });
                            if (reduceAmountDislike)
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_LIKE,
                                    true,
                                    updateReplyLikeCounts,
                                );
                            else
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_LIKE,
                                    true,
                                    updateReplyLikeCounts,
                                );
                        } else
                            return new ResponseSuccess(
                                200,
                                constants.success.SUCCESS_CREATE_LIKE,
                                true,
                                updateReplyLikeCounts,
                            );
                    } else
                        return new ResponseSuccess(
                            200,
                            constants.success.SUCCESS_CREATE_LIKE,
                            true,
                            updateReplyLikeCounts,
                        );
                }
                return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            }
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_LIKE, true);
        }
        return new ResponseError(400, constants.error.ERROR_LIKE_ONCE_TIME, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteLike = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistLike = await configs.db.like.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isExistLike) {
            const deletedLike = await configs.db.like.delete({
                where: {
                    id: isExistLike.id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (deletedLike && deletedLike.reply_id == null) {
                const reduceAmountLike = await configs.db.commentLecture.update({
                    where: {
                        id: deletedLike.comment_id,
                    },
                    data: {
                        likes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (reduceAmountLike) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_LIKE, true);
                else return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            } else if (deletedLike && deletedLike.reply_id != null) {
                const reduceAmountLike = await configs.db.replyCommentLecture.update({
                    where: {
                        id: deletedLike.reply_id,
                    },
                    data: {
                        likes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        liked_by: true,
                    },
                });
                if (reduceAmountLike) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_LIKE, true);
                else return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            }
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseSuccess(404, constants.error.ERROR_LIKE_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createDislike = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistDislike = await configs.db.dislike.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (!isExistDislike) {
            const newDislike = await configs.db.dislike.create({
                data: {
                    user_id: Number(user_id),
                    comment_id,
                    reply_id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (newDislike.reply_id == null) {
                const updateCommentDislikeCounts = await configs.db.commentLecture.update({
                    where: {
                        id: newDislike.comment_id,
                    },
                    data: {
                        dislikes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (updateCommentDislikeCounts) {
                    const findLike = await configs.db.like.findFirst({
                        where: {
                            user_id: newDislike.user_id,
                            comment_id: newDislike.comment_id,
                            reply_id: null,
                        },
                    });
                    if (findLike) {
                        const deleteLike = await configs.db.like.delete({
                            where: {
                                id: findLike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: null,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteLike) {
                            const reduceAmountLike = await configs.db.commentLecture.update({
                                where: {
                                    id: deleteLike.comment_id,
                                },
                                data: {
                                    likes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    liked_by: true,
                                },
                            });
                            if (reduceAmountLike)
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_DISLIKE,
                                    true,
                                    updateCommentDislikeCounts,
                                );
                            else
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_DISLIKE,
                                    true,
                                    updateCommentDislikeCounts,
                                );
                        } else
                            return new ResponseSuccess(
                                200,
                                constants.success.SUCCESS_CREATE_DISLIKE,
                                true,
                                updateCommentDislikeCounts,
                            );
                    } else
                        return new ResponseSuccess(
                            200,
                            constants.success.SUCCESS_CREATE_DISLIKE,
                            true,
                            updateCommentDislikeCounts,
                        );
                }
                return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            } else if (newDislike.reply_id != null) {
                const updateReplyDislikeCounts = await configs.db.replyCommentLecture.update({
                    where: {
                        id: newDislike.reply_id,
                    },
                    data: {
                        dislikes_count: {
                            increment: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (updateReplyDislikeCounts) {
                    const findLike = await configs.db.like.findFirst({
                        where: {
                            user_id: newDislike.user_id,
                            comment_id: newDislike.comment_id,
                            reply_id: newDislike.reply_id,
                        },
                    });
                    if (findLike) {
                        const deleteLike = await configs.db.like.delete({
                            where: {
                                id: findLike.id,
                                // user_id: newDislike.user_id,
                                // comment_id: newDislike.comment_id,
                                // reply_id: findLike.reply_id,
                            },
                            include: {
                                commentLecture: true,
                                replyCommentLecture: true,
                            },
                        });
                        if (deleteLike) {
                            const reduceAmountLike = await configs.db.replyCommentLecture.update({
                                where: {
                                    id: deleteLike.reply_id || undefined,
                                },
                                data: {
                                    likes_count: {
                                        decrement: 1,
                                    },
                                },
                                include: {
                                    liked_by: true,
                                },
                            });
                            if (reduceAmountLike)
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_DISLIKE,
                                    true,
                                    updateReplyDislikeCounts,
                                );
                            else
                                return new ResponseSuccess(
                                    200,
                                    constants.success.SUCCESS_CREATE_DISLIKE,
                                    true,
                                    updateReplyDislikeCounts,
                                );
                        } else
                            return new ResponseSuccess(
                                200,
                                constants.success.SUCCESS_CREATE_DISLIKE,
                                true,
                                updateReplyDislikeCounts,
                            );
                    } else
                        return new ResponseSuccess(
                            200,
                            constants.success.SUCCESS_CREATE_DISLIKE,
                            true,
                            updateReplyDislikeCounts,
                        );
                }
                return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            }
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DISLIKE, true);
        }
        return new ResponseError(400, constants.error.ERROR_DISLIKE_ONCE_TIME, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteDislike = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { comment_id, reply_id } = req.body;
        const isExistDislike = await configs.db.dislike.findFirst({
            where: {
                user_id: user_id,
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isExistDislike) {
            const deletedDislike = await configs.db.dislike.delete({
                where: {
                    id: isExistDislike.id,
                },
                include: {
                    commentLecture: true,
                    replyCommentLecture: true,
                },
            });
            if (deletedDislike && deletedDislike.reply_id == null) {
                const reduceAmountDislike = await configs.db.commentLecture.update({
                    where: {
                        id: deletedDislike.comment_id,
                    },
                    data: {
                        dislikes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (reduceAmountDislike) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DISLIKE, true);
                else return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            } else if (deletedDislike && deletedDislike.reply_id != null) {
                const reduceAmountDislike = await configs.db.replyCommentLecture.update({
                    where: {
                        id: deletedDislike.reply_id,
                    },
                    data: {
                        dislikes_count: {
                            decrement: 1,
                        },
                    },
                    include: {
                        disliked_by: true,
                    },
                });
                if (reduceAmountDislike) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DISLIKE, true);
                else return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
            }
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseSuccess(404, constants.error.ERROR_DISLIKE_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const checkLikeExist = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const {comment_id, reply_id} = req.body;
        const isLikeExist = await configs.db.like.findFirst({
            where: {
                user_id: Number(user_id),
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isLikeExist) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isLikeExist);
        return new ResponseSuccess(404, constants.error.ERROR_LIKE_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const checkDislikeExist = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const {comment_id, reply_id} = req.body;
        const isDislikeExist = await configs.db.dislike.findFirst({
            where: {
                user_id: Number(user_id),
                comment_id: comment_id,
                reply_id: reply_id,
            },
        });
        if (isDislikeExist) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isDislikeExist);
        return new ResponseSuccess(404, constants.error.ERROR_DISLIKE_NOT_FOUND, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const reactionService = {
    createLike,
    deleteLike,
    createDislike,
    deleteDislike,
    checkLikeExist,
    checkDislikeExist,
};
export default reactionService;
