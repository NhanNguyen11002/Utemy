import { IRequestWithId } from "~/types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const createApproval = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.body;
        const user_id = req.user_id;
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                status: false,
            },
        });
        if (!isCourseExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const createApproval = await configs.db.approval.create({
            data: {
                course_id: Number(course_id),
            },
        });
        if (!createApproval) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_APPROVAL, true, createApproval);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getApprovalsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const pageSize = configs.general.PAGE_SIZE;
        const user_id = req.user_id;
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: Number(user_id),
                is_admin: true,
            },
        });
        const getApprovals = await configs.db.approval.findMany({
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
            where: {
                is_handle: false,
                course: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
            include: {
                course: {
                    select: {
                        title: true,
                        thumbnail: true,
                        slug: true,
                        id: true,
                    },
                },
            },
        });
        if (!getApprovals) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        const mappedData = getApprovals.map((approval) => {
            const temp = {
                approval_id: approval.id,
                course_id: approval.course.id,
                course_title: approval.course.title,
                course_thumbnail: approval.course.thumbnail,
                course_slug: approval.course.slug,
                created_at: approval.created_at,
            };
            return temp;
        });
        const totalRecord = await configs.db.approval.count({
            where: {
                is_handle: false,
                course: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const data = {
            total_page: totalPage,
            totalRecord: totalRecord,
            data: mappedData,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_APPROVAL, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const ApprovalServices = {
    createApproval,
    getApprovalsWithPagination,
};
export default ApprovalServices;
