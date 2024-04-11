import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { EventResponse } from "~/types/event.type";
import { DateTime } from "luxon";


const createEvent = async (req: IRequestWithId, formData: FormData): Promise<ResponseBase> => {
    try {
        // const { code, discount, valid_start, valid_until, remain_quantity, is_event } = req.body;
        const name = req.body.name as string;
        const description = req.body.description as string;
        const startDate = req.body.start_date as string;
        const endDate = req.body.end_date as string;
        const startDateISO = DateTime.fromISO(req.body.start_date); // Chuyển đổi start_date thành đối tượng DateTime
        const endDateISO = DateTime.fromISO(req.body.end_date); // Chuyển đổi end_date thành đối tượng DateTime
        // const isActive = req.body.is_active === "true";
        const user_id = Number(req.user_id);
        const now = DateTime.local(); // Ngày giờ hiện tại
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        let isActive = false;
        // So sánh start_date và end_date với ngày giờ hiện tại
        if (startDateISO <= now && endDateISO > now) {
            isActive = true;
        }
        const isExistActiveEvent = await configs.db.event.findFirst({
            where: {
                is_active: true,
                is_delete: false,
            },
        });
        if (isExistActiveEvent && isActive)
            return new ResponseError(
                501,
                constants.error.ERROR_EXIST_ACTIVE_EVENT +
                    ", please choose the start date of this event later than " +
                    isExistActiveEvent.end_date,
                false,
            );
        const createEvent = await configs.db.event.create({
            data: {
                name: name,
                description: description,
                start_date: startDate,
                end_date: endDate,
                is_active: isActive,
            },
        });
        if (createEvent) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        else {
            // console.error("Error occurred while creating coupon:", createCoupon); // Log lỗi cụ thể
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        console.error("An error occurred while creating coupon:", error); // Log lỗi cụ thể
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateEvent = async (req: IRequestWithId, formData: FormData): Promise<ResponseBase> => {
    try {
        const { event_id } = req.params;
        // const { code, discount, valid_start, valid_until, is_event, remain_quantity } = req.body;
        const name = req.body.name as string;
        const description = req.body.description as string;
        const startDate = req.body.start_date as string;
        const endDate = req.body.end_date as string;
        const startDateISO = DateTime.fromISO(req.body.start_date); // Chuyển đổi start_date thành đối tượng DateTime
        const endDateISO = DateTime.fromISO(req.body.end_date); // Chuyển đổi end_date thành đối tượng DateTime
        // const isActive = req.body.is_active === "true";
        const user_id = Number(req.user_id);
        const now = DateTime.local(); // Ngày giờ hiện tại
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        let isActive = false;
        // So sánh start_date và end_date với ngày giờ hiện tại
        if (startDateISO <= now && endDateISO > now) {
            isActive = true;
        }
        const isEventExist = await configs.db.event.findUnique({
            where: {
                id: Number(event_id),
            },
        });
        if (!isEventExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const whereConditionForIsExistActiveEvent = {
            is_active: true,
            is_delete: false,
            NOT: {
                id: parseInt(event_id),
            },
        };
        const isExistActiveEvent = await configs.db.event.findFirst({
            where: whereConditionForIsExistActiveEvent,
        });
        if (isExistActiveEvent && isActive)
            return new ResponseError(
                501,
                constants.error.ERROR_EXIST_ACTIVE_EVENT +
                    ", please choose the start date of this event later than " +
                    isExistActiveEvent.end_date,
                false,
            );

        const updateCoupon = await configs.db.event.update({
            data: {
                name: name,
                description: description,
                start_date: startDate,
                end_date: endDate,
                is_active: isActive,
            },
            where: {
                id: isEventExist.id,
            },
        });
        if (updateCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
        {
            console.error("error upat:", updateCoupon);
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteEvent = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { event_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isEventExist = await configs.db.event.findUnique({
            where: {
                id: Number(event_id),
            },
        });
        if (!isEventExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteEvent = await configs.db.event.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isEventExist.id,
            },
        });
        if (deleteEvent) {
            const deleteCoupon = await configs.db.coupon.updateMany({
                data: {
                    is_delete: true,
                },
                where: {
                    event_id: isEventExist.id,
                },
            });
            if (deleteCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getEventsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const parsedSearchItem = searchItem as string;
        const pageSize = configs.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * pageSize;
        const getAllEvent = await configs.db.event.findMany({
            skip,
            take: pageSize,
            where: {
                name: {
                    contains: parsedSearchItem,
                },
                is_delete: false,
            },
            orderBy: {
                start_date: "desc",
            },
            include: {
                coupons: true,
            }
        });
        if (!getAllEvent) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs.db.event.count({
            where: {

                is_delete: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const events: EventResponse[] = [];
        getAllEvent.map((item) => {
            const event: EventResponse = {
                event_id: item.id,
                name: item.name,
                description: item.description,
                is_delete: item.is_delete,
                is_active: item.is_active,
                start_date: DateTime.fromISO(item.start_date.toISOString()),
                end_date: DateTime.fromISO(item.end_date.toISOString()),
                coupons: (item.coupons as any).map((cp: any) => {
                    return {
                        coupon_id: cp.id,
                        code: cp.code,
                        discount: cp.discount,
                        valid_start: cp.valid_start,
                        valid_until: cp.valid_until,
                        remain_quantity: cp.remain_quantity,
                        is_event: cp.is_event,
                        max_discount_money: cp.max_discount_money,
                    };
                }),
            };
            return events.push(event);
        });
        const eventsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: events,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, eventsResponseData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAllEvents = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const getAllEvent = await configs.db.event.findMany({
            where: {
                is_delete: false,
                // is_active: true,
            },
            orderBy: {
                start_date: "desc",
            },
            include: {
                coupons: true,
            },
        });
        if (!getAllEvent) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs.db.event.count({
            where: {
                is_delete: false,
            },
        });
        const events: EventResponse[] = [];
        getAllEvent.map((item) => {
            const event: EventResponse = {
                event_id: item.id,
                name: item.name,
                description: item.description,
                is_delete: item.is_delete,
                is_active: item.is_active,
                start_date: DateTime.fromISO(item.end_date.toISOString()),
                end_date: DateTime.fromISO(item.start_date.toISOString()),
                coupons: (item.coupons as any).map((cp: any) => {
                    return {
                        coupon_id: cp.id,
                        code: cp.code,
                        discount: cp.discount,
                        valid_start: cp.valid_start,
                        valid_until: cp.valid_until,
                        remain_quantity: cp.remain_quantity,
                        is_event: cp.is_event,
                        max_discount_money: cp.max_discount_money,
                    };
                }),
            };
            return events.push(event);
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, events);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getEventById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { event_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const getEvent = await configs.db.event.findFirst({
            where: {
                id: Number(event_id),
                is_delete: false,
            },
            include: {
                coupons: true,
            },
        });
        if (!getEvent) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const item = getEvent; // Đây là đối tượng trả về từ getEvent

        const event: EventResponse = {
            event_id: item.id,
            name: item.name,
            description: item.description,
            is_delete: item.is_delete,
            is_active: item.is_active,
            start_date: DateTime.fromISO(item.start_date.toISOString()),
            end_date: DateTime.fromISO(item.end_date.toISOString()),
            coupons: (item.coupons as any).map((cp: any) => { 
                return {
                    coupon_id: cp.id,
                    code: cp.code,
                    discount: cp.discount,
                    valid_start: cp.valid_start,
                    valid_until: cp.valid_until,
                    remain_quantity: cp.remain_quantity,
                    is_event: cp.is_event,
                    max_discount_money: cp.max_discount_money,
                };
            }),
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, event);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getActiveEvent = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        // const isAdmin = await configs.db.user.findFirst({
        //     where: {
        //         id: user_id,
        //         is_admin: true,
        //     },
        // });
        // if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isActiveEvent = await configs.db.event.findFirst({
            where: {
                is_active: true,
                is_delete: false,
            },
        });
        if (!isActiveEvent) return new ResponseError(404, constants.error.ERROR_EVENT_NOT_FOUND, false);
        console.log(isActiveEvent);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isActiveEvent);
    } catch (error) {
        console.error("Error occurred:", error);

        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const eventService = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsWithPagination,
    getAllEvents,
    getEventById,
    getActiveEvent,
};
export default eventService;
