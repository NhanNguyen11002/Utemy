import { IRequestWithId } from "~/types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DecisionType } from "~/types/decision";

const createDecision = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id, type, content } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isCourseExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const createDecision = await configs.db.decision.create({
            data: {
                course_id: Number(course_id),
                type,
                content,
                user_id,
            },
        });
        if (!createDecision) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DECISION, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getDecisionsByCourseId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const pageSize = configs.general.PAGE_SIZE;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        const isAuthor = await configs.db.course.findFirst({
            where: {
                author_id: user_id,
                id: Number(course_id),
            },
        });
        if (!isAdmin && !isAuthor) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const getDecisions = await configs.db.decision.findMany({
            where: {
                course_id: Number(course_id),
            },
            orderBy: {
                created_at: "desc",
            },
            take: pageSize,
        });
        if (!getDecisions) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        const data: DecisionType[] = getDecisions.map((decision) => {
            const temp: DecisionType = { ...decision, decision_id: decision.id };
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
const handleDecision = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { decision_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isDecisionExist = await configs.db.decision.findFirst({
            where: {
                id: Number(decision_id),
                is_handle: false,
            },
        });
        if (!isDecisionExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);

        const isAuthor = await configs.db.course.findFirst({
            where: {
                author_id: user_id,
                id: isDecisionExist.course_id,
            },
        });
        if (!isAuthor) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const handleDecision = await configs.db.decision.update({
            where: {
                id: Number(decision_id),
            },
            data: {
                is_handle: true,
            },
        });
        if (!handleDecision) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCES_HANDLE_DECISION, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const DecisionServices = {
    createDecision,
    getDecisionsByCourseId,
    handleDecision,
};
export default DecisionServices;
