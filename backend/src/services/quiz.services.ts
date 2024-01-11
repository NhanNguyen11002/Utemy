import { IRequestWithId } from "~/types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { FeedbackResponse } from "../types/feedback.type";

const createQuizGroup = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { title, description } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const createFeedback = await configs.db.quizGroup.create({
            data: {
                user_id,
                title,
                description,
            },
        });
        if (!createFeedback) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_FEEDBACK, true); //
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateQuizGroup = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { quiz_group_id } = req.params;
        const { title, description } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateQuizGroup = await configs.db.quizGroup.update({
            where: {
                id: Number(quiz_group_id),
            },
            data: {
                title,
                description,
            },
        });
        if (updateQuizGroup) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_FEEDBACK, true); //
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteQuizGroup = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { quiz_group_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteQuizGroup = await configs.db.quizGroup.update({
            where: {
                id: Number(quiz_group_id),
            },
            data: {
                is_delete: true,
            },
        });
        if (deleteQuizGroup) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true); //
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllQuizGroup = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const getAllQuizGroup = await configs.db.quizGroup.findMany({
            where: {
                user_id,
                is_delete: false,
            },
        });
        if (!getAllQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const data = getAllQuizGroup.map((group) => {
            const temp = {
                quiz_group_id: group.id,
                title: group.title,
                description: group.description,
            };
            return temp;
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllQuizGroupHasQuiz = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const getAllQuizGroup = await configs.db.quizGroup.findMany({
            where: {
                user_id,
                is_delete: false,
                NOT: {
                    number_of_quiz: 0,
                },
            },
        });
        if (!getAllQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const data = getAllQuizGroup.map((group) => {
            const temp = {
                quiz_group_id: group.id,
                title: group.title,
                description: group.description,
            };
            return temp;
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createQuiz = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { question, type, quiz_group_id, quiz_answer } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
            },
        });
        if (!isExistQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const createQuiz = await configs.db.quiz.create({
            data: {
                quiz_group_id: Number(quiz_group_id),
                type,
                question,
            },
        });
        const updateQuizGroup = await configs.db.quizGroup.update({
            data: {
                number_of_quiz: { increment: 1 },
            },
            where: { id: isExistQuizGroup.id },
        });
        const createAnswerData = quiz_answer.map((answer: any) => {
            const temp = {
                quiz_id: createQuiz.id,
                answer: answer.answer,
                is_correct: answer.is_correct,
            };
            return temp;
        });
        const createAnswer = await configs.db.quizAnswer.createMany({
            data: createAnswerData,
        });
        if (createAnswer) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true); //
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateQuiz = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { quiz_id } = req.params;
        const { question, type, quiz_answer } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuiz = await configs.db.quiz.findFirst({
            where: {
                id: Number(quiz_id),
                quiz_group: {
                    user_id,
                },
            },
            include: {
                quiz_group: true,
            },
        });
        if (!isExistQuiz) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateQuiz = await configs.db.quiz.update({
            data: {
                type,
                question,
            },
            where: {
                id: isExistQuiz.id,
            },
        });
        const clearAnswer = await configs.db.quizAnswer.deleteMany({
            where: {
                quiz_id: isExistQuiz.id,
            },
        });
        const createAnswerData = quiz_answer.map((answer: any) => {
            const temp = {
                quiz_id: isExistQuiz.id,
                answer: answer.answer,
                is_correct: answer.is_correct,
            };
            return temp;
        });
        const createAnswer = await configs.db.quizAnswer.createMany({
            data: createAnswerData,
        });
        if (createAnswer) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true); //
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteQuiz = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { quiz_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuiz = await configs.db.quiz.findFirst({
            where: {
                id: Number(quiz_id),
                quiz_group: {
                    user_id,
                },
            },
            include: {
                quiz_group: true,
            },
        });
        if (!isExistQuiz) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteQuiz = await configs.db.quiz.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isExistQuiz.id,
            },
        });
        const updateQuizGroup = await configs.db.quizGroup.update({
            data: {
                number_of_quiz: { decrement: 1 },
            },
            where: { id: isExistQuiz.quiz_group_id },
        });
        // const clearAnswer = await configs.db.quizAnswer.deleteMany({
        //     where: {
        //         quiz_id: isExistQuiz.id,
        //     },
        // });

        if (deleteQuiz) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true); //
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAllQuizByGroupId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const searchItem: string | undefined = req.query.search_item ? (req.query.search_item as string) : undefined;
        const { quiz_group_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistQuizGroup = await configs.db.quizGroup.findFirst({
            where: {
                user_id,
                id: Number(quiz_group_id),
                is_delete: false,
            },
        });
        if (!isExistQuizGroup) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const getAllQuiz = await configs.db.quiz.findMany({
            where: {
                quiz_group_id: isExistQuizGroup.id,
                question: {
                    contains: searchItem?.toLowerCase(),
                },
                is_delete: false,
            },
            include: {
                quiz_answer: {
                    select: {
                        id: true,
                        answer: true,
                        is_correct: true,
                    },
                },
            },
        });
        const listQuiz = getAllQuiz.map((quiz) => {
            const temp = {
                quiz_id: quiz.id,
                question: quiz.question,
                type: quiz.type,
                created_at: quiz.created_at,
                updated_at: quiz.updated_at.toString(),
                quiz_group_id: quiz.quiz_group_id,
                quiz_answer: quiz.quiz_answer.map((answer) => {
                    const temp = { quiz_answer_id: answer.id, answer: answer.answer, is_correct: answer.is_correct };
                    return temp;
                }),
            };
            return temp;
        });
        const data = {
            quiz_group_id: isExistQuizGroup.id,
            quiz: listQuiz,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const QuizServices = {
    createQuizGroup,
    updateQuiz,
    updateQuizGroup,
    createQuiz,
    deleteQuiz,
    deleteQuizGroup,
    getAllQuizByGroupId,
    getAllQuizGroup,
    getAllQuizGroupHasQuiz,
};
export default QuizServices;
