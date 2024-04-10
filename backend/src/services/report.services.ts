import { IRequestWithId } from "~/types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";

const createReport = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id, is_lecture, lecture_id, title, content } = req.body;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isCourseExist = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
            },
        });
        if (!isCourseExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        let data: any = {
            course_id: Number(course_id),
            content,
            user_id,
            is_handle: false,
            title,
        };
        if (is_lecture) data = { ...data, lecture_id: Number(lecture_id), is_lecture: true };
        const createReport = await configs.db.report.create({
            data,
        });
        if (!createReport) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_REPORT, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getReportByCourseId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const { page_index: pageIndex } = req.query;
        const pageSize = configs.general.PAGE_SIZE;

        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const getReport = await configs.db.report.findMany({
            where: {
                course_id: Number(course_id),
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                lecture: {
                    include: {
                        lesson: true,
                        test: true,
                    },
                },
                course: true,
            },
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
        });
        if (!getReport) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        const totalRecord = await configs.db.report.count({
            where: {
                course_id: Number(course_id),
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const reports = getReport.map((report) => {
            let lecture = null;
            if (report.lecture) {
                const content = report.lecture.type === "Lesson" ? report.lecture.lesson : report.lecture.test;
                lecture = { lecture_id: report.lecture.id, content };
            }
            const temp = {
                ...report,
                report_id: report.id,
                lecture,
            };
            return temp;
        });
        const data = {
            data: reports,
            total_page: totalPage,
            total_record: totalRecord,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_APPROVAL, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllReportWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const pageSize = configs.general.PAGE_SIZE;

        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const getReport = await configs.db.report.findMany({
            where: {
                is_handle: false,
                course: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                lecture: {
                    include: {
                        test: true,
                        lesson: true,
                    },
                },
                course: true,
            },
            take: pageSize,
            skip: (Number(pageIndex) - 1) * pageSize,
        });
        if (!getReport) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        const totalRecord = await configs.db.report.count({
            where: {
                is_handle: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const reports = getReport.map((report) => {
            let lecture = null;
            if (report.lecture) {
                const content = report.lecture.type === "Lesson" ? report.lecture.lesson : report.lecture.test;
                lecture = { lecture_id: report.lecture.id, content };
            }
            const temp = {
                ...report,
                report_id: report.id,
                lecture,
            };
            return temp;
        });
        const data = {
            data: reports,
            total_page: totalPage,
            total_record: totalRecord,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_APPROVAL, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const handleReport = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { report_id } = req.params;
        const user_id = Number(req.user_id);
        if (!user_id) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const isReportExist = await configs.db.report.findFirst({
            where: {
                id: Number(report_id),
                is_handle: false,
            },
        });
        if (!isReportExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);

        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(404, constants.error.ERROR_UNAUTHORIZED, false);
        const handleReport = await configs.db.report.update({
            where: {
                id: Number(report_id),
            },
            data: {
                is_handle: true,
            },
        });
        if (!handleReport) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_HANDLE_REPORT, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const ReportServices = {
    createReport,
    getReportByCourseId,
    handleReport,
    getAllReportWithPagination,
};
export default ReportServices;
