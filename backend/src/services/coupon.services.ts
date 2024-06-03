import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { CouponResponse } from "~/types/coupon.type";
import { DateTime } from "luxon";

const createCoupon = async (req: IRequestWithId, formData: FormData): Promise<ResponseBase> => {
    try {
        // const { code, discount, valid_start, valid_until, remain_quantity, is_event } = req.body;
        const code = req.body.code as string;
        const discount = Number(req.body.discount);
        const validStart = req.body.valid_start as string;
        const validUntil = req.body.valid_until as string;
        const remainQuantity = Number(req.body.remain_quantity);
        const eventId = Number(req.body.event_id) || null;
        const isEvent = req.body.is_event === "true";
        const maxDiscountMoney = Number(req.body.max_discount_money);
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const createCoupon = await configs.db.coupon.create({
            data: {
                code: code,
                discount: discount / 100,
                valid_start: validStart,
                valid_until: validUntil,
                remain_quantity: remainQuantity,
                is_event: isEvent,
                max_discount_money: maxDiscountMoney,
                event_id: eventId,
            },
        });
        if (createCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
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
const updateCoupon = async (req: IRequestWithId, formData: FormData): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        // const { code, discount, valid_start, valid_until, is_event, remain_quantity } = req.body;
        const code = req.body.code as string;
        const discount = Number(req.body.discount);
        const validStart = req.body.valid_start as string;
        const validUntil = req.body.valid_until as string;
        const eventId = Number(req.body.event_id) || null;
        const remainQuantity = Number(req.body.remain_quantity);
        const isEvent = req.body.is_event === "true";
        const maxDiscountMoney = Number(req.body.max_discount_money);
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateCoupon = await configs.db.coupon.update({
            data: {
                code: code,
                discount: discount / 100,
                valid_start: validStart,
                valid_until: validUntil,
                remain_quantity: remainQuantity,
                is_event: isEvent,
                max_discount_money: maxDiscountMoney,
                event_id: eventId,
            },
            where: {
                id: isCouponExsist.id,
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
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isCouponExsist = await configs.db.coupon.findUnique({
            where: {
                id: Number(coupon_id),
            },
        });
        if (!isCouponExsist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteCoupon = await configs.db.coupon.update({
            data: {
                is_delete: true,
            },
            where: {
                id: isCouponExsist.id,
            },
        });
        if (deleteCoupon) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
// const getCouponByCode = async (req: IRequestWithId): Promise<ResponseBase> => {
//     try {
//         const { code } = req.params;
//         const user_id = Number(req.user_id);
//         const isCouponExsist = await configs.db.coupon.findFirst({
//             where: {
//                 code,
//                 is_delete: false,
//                 is_event: false,
//                 valid_until: {
//                     gt: new Date(),
//                 },
//                 remain_quantity: {
//                     gt: 0,
//                 },
//             },
//             select: {
//                 id: true,
//                 code: true,
//                 discount: true,
//                 valid_until: true,
//             },
//         });
//         if (isCouponExsist) {
//             const isCouponUsed = await configs.db.couponHistory.findFirst({
//                 where: {
//                     coupon_id: isCouponExsist.id,
//                     user_id,
//                 },
//                 include: {
//                     coupon: true,
//                 },
//             });

//             if (isCouponUsed && !isCouponUsed.coupon.is_event) {
//                 // Đã sử dụng coupon và coupon không phải là event
//                 return new ResponseError(400, constants.error.ERROR_COUPON_USED, false);
//             }
//         } else {
//             // Xử lý trường hợp coupon không tồn tại
//             return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
//         }
//         return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExsist);
//     } catch (error) {
//         if (error instanceof PrismaClientKnownRequestError) {
//             return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
//         }
//         return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
//     }
// };
const getCouponByCode = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { code } = req.params;
        const user_id = Number(req.user_id);

        // Tìm kiếm trong bảng coupon_owner
        const couponOwnersWithCouponInfo: any[] = await configs.db.$queryRaw`
            SELECT
                CO.coupon_id as id,
                CO.user_id,
                COALESCE(SUM(CO.quantity), 0) AS total_quantity,
                C.code,
                ROUND(C.discount, 2) AS discount,
                C.is_delete,
                C.valid_start,
                C.valid_until,
                C.remain_quantity,
                C.is_event,
                C.max_discount_money,
                C.event_id
            FROM
                coupon_owner CO
            JOIN
                coupon C ON CO.coupon_id = C.id
            WHERE
                C.valid_start < UTC_TIMESTAMP()  -- Lọc ra các bản ghi có valid_start nhỏ hơn ngày hiện tại
				AND C.valid_until > UTC_TIMESTAMP()
            GROUP BY
                CO.coupon_id, CO.user_id;
        `;

        if (couponOwnersWithCouponInfo.length > 0) {
            const findCouponEventByCode = couponOwnersWithCouponInfo.find(
                (coupon) => coupon.code === code && coupon.user_id === user_id,
            );
            if (findCouponEventByCode) {
                console.log(findCouponEventByCode);
                return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, findCouponEventByCode);
            } else {
                const isUsedCoupon = await configs.db.couponHistory.findFirst({
                    where: {
                        user_id: user_id,
                        coupon: {
                            code: code,
                        },
                        is_from_event: false,
                    },
                    select: {
                        user_id: true,
                        coupon: {
                            select: {
                                code: true,
                            },
                        },
                    },
                });
                if (!isUsedCoupon) {
                    // Nếu không có dữ liệu trong bảng coupon_owner và chưa có lịch sử sd cp đó, tiếp tục kiểm tra trong bảng coupon
                    const isCouponExist = await configs.db.coupon.findFirst({
                        where: {
                            code: code,
                            is_delete: false,
                            is_event: false,
                            valid_until: {
                                gt: new Date(),
                            },
                            valid_start: {
                                lt: new Date(),
                            },
                            remain_quantity: {
                                gt: 0,
                            },
                        },
                        select: {
                            id: true,
                            code: true,
                            discount: true,
                            valid_until: true,
                            max_discount_money: true,
                            remain_quantity: true,
                        },
                    });
                    if (isCouponExist) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExist);
                    } else return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
                } else return new ResponseError(404, constants.error.ERROR_COUPON_USED, false);
            }
        } else return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
    } catch (error) {
        // Xử lý trường hợp coupon không tồn tại
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
    // return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
};

const GetCouponsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
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
        const getAllCoupon = await configs.db.coupon.findMany({
            skip,
            take: pageSize,
            where: {
                code: {
                    contains: parsedSearchItem,
                },
                is_delete: false,
            },
            orderBy: {
                valid_start: "desc",
            },
            include: {
                event: true,
            },
        });
        if (!getAllCoupon) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const totalRecord = await configs.db.coupon.count({
            where: {
                is_delete: false,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const coupons: CouponResponse[] = [];
        getAllCoupon.map((item) => {
            const coupon: CouponResponse = {
                coupon_id: item.id,
                code: item.code,
                discount: item.discount,
                is_delete: item.is_delete,
                remain_quantity: item.remain_quantity,
                valid_start: DateTime.fromISO(item.valid_start.toISOString()),
                valid_until: DateTime.fromISO(item.valid_until.toISOString()),
                is_event: item.is_event,
                max_discount_money: item.max_discount_money,
                event_id: item.event_id,
                event_name: item.event ? item.event.name : null, // Lấy tên của sự kiện
            };
            return coupons.push(coupon);
        });
        const categoriesResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: coupons,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoriesResponseData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
// const createCouponHistory = async (req: IRequestWithId): Promise<ResponseBase> => {
//     try {
//         const { coupon_id } = req.params;
//         const user_id = Number(req.user_id);
//         // Kiểm tra xem mã coupon có tồn tại và có thể sử dụng không
//         const coupon = await configs.db.coupon.findUnique({
//             where: {
//                 id: Number(coupon_id),
//                 is_delete: false,
//                 valid_until: {
//                     gt: new Date(),
//                 },
//             },
//         });

//         if (!coupon) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);

//         // Ghi lại việc sử dụng mã coupon vào bảng coupon_history
//         const record = await configs.db.couponHistory.create({
//             data: {
//                 coupon_id: coupon.id,
//                 user_id: user_id,
//                 invoice_id: invoice_id,
//             },
//         });
//         if (!record) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
//         return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
//     } catch (error) {
//         if (error instanceof PrismaClientKnownRequestError) {
//             return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
//         }
//         return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
//     }
// };
const getCouponHistoryByUserId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllCouponHistory = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createCouponOwner = async (req: IRequestWithId, coupon_id: number, event_id: number): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);

        // Lấy ra một coupon có trường is_event được đánh dấu là true
        const coupon = await configs.db.coupon.findFirst({
            where: {
                is_event: true,
                remain_quantity: {
                    gt: 0, // Đảm bảo còn voucher để săn
                },
            },
        });

        if (!coupon) {
            return new ResponseError(404, "No available coupons", false);
        }

        // Kiểm tra xem người dùng đã có dữ liệu trong bảng coupon_owner chưa
        const existingCouponOwner = await configs.db.couponOwner.findFirst({
            where: {
                coupon_id: coupon_id,
                user_id,
                event_id: event_id,
            },
        });

        if (!existingCouponOwner) {
            // Tạo mới dữ liệu cho coupon_owner nếu chưa tồn tại
            const createNewOwner = await configs.db.couponOwner.create({
                data: {
                    coupon_id: coupon_id,
                    event_id: event_id,
                    user_id,
                    quantity: 1, // Mỗi lần săn được coupon sẽ có số lượng là 1
                },
            });
            // Giảm số lượng voucher trong bảng coupon sau mỗi lần săn
            const updateCoupon = await configs.db.coupon.update({
                where: {
                    id: coupon_id,
                },
                data: {
                    remain_quantity: {
                        decrement: 1, // Giảm số lượng voucher đi 1
                    },
                },
            });
            const historySpin = await configs.db.userEvent.create({
                data: {
                    user_id,
                    event_id: event_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            if (createNewOwner && updateCoupon && historySpin) console.log(createNewOwner);
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, createNewOwner);
        } else {
            // Cập nhật số lượng voucher trong bảng coupon_owner
            const updateOwner = await configs.db.couponOwner.update({
                where: {
                    id: existingCouponOwner.id,
                },
                data: {
                    quantity: {
                        increment: 1, // Tăng số lượng voucher lên 1
                    },
                },
            });
            // Giảm số lượng voucher trong bảng coupon sau mỗi lần săn
            const updateCoupon = await configs.db.coupon.update({
                where: {
                    id: coupon_id,
                },
                data: {
                    remain_quantity: {
                        decrement: 1, // Giảm số lượng voucher đi 1
                    },
                },
            });
            const historySpin = await configs.db.userEvent.create({
                data: {
                    user_id,
                    event_id: event_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            if (updateOwner && updateCoupon && historySpin)
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, updateOwner);
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
const createHistoryForGoodLuckNextTime = async (req: IRequestWithId, event_id: number): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const historySpin = await configs.db.userEvent.create({
            data: {
                user_id,
                event_id: event_id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        if (!historySpin) return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllEventCoupon = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        // const isAdmin = await configs.db.user.findFirst({
        //     where: {
        //         id: user_id,
        //         is_admin: true,
        //     },
        // });
        // if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const getAllEventCoupon = await configs.db.coupon.findMany({
            where: {
                is_delete: false,
                is_event: true,
                remain_quantity: {
                    gt: 0,
                },
            },
            select: {
                id: true,
                code: true,
                discount: true,
                valid_until: true,
            },
        });
        if (!getAllEventCoupon) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getAllEventCoupon);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllEventCouponByEventId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { event_id } = req.params;
        // const isAdmin = await configs.db.user.findFirst({
        //     where: {
        //         id: user_id,
        //         is_admin: true,
        //     },
        // });
        // if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isActiveEvent = await configs.db.event.findFirst({
            where: {
                id: Number(event_id),
                is_active: true,
                is_delete: false,
            },
        });
        if (!isActiveEvent) return new ResponseError(404, constants.error.ERROR_EVENT_NOT_FOUND, false);
        const getAllEventCouponByEventId = await configs.db.coupon.findMany({
            where: {
                is_delete: false,
                is_event: true,
                event_id: Number(event_id),
                remain_quantity: {
                    gt: 0,
                },
                valid_until: {
                    gt: new Date(),
                },
            },
            select: {
                id: true,
                // code: true,
                discount: true,
                valid_until: true,
                event_id: true,
                ratio: true,
            },
        });
        if (!getAllEventCouponByEventId) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getAllEventCouponByEventId);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCouponByIdOnDate = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        const user_id = Number(req.user_id);
        const isCouponExist = await configs.db.coupon.findFirst({
            where: {
                id: Number(coupon_id),
                is_delete: false,
                valid_until: {
                    gt: new Date(),
                },
                remain_quantity: {
                    gt: -1,
                },
            },
            include: {
                ratio: true,
            }
        });
        if (isCouponExist) {
            const isCouponUse = await configs.db.couponHistory.findFirst({
                where: {
                    coupon_id: isCouponExist.id,
                    user_id,
                    is_from_event: false,
                },
                include: {
                    coupon: true,
                },
            });

            if (isCouponUse && !isCouponUse.coupon.is_event) {
                // Đã sử dụng coupon và coupon không phải là event
                return new ResponseError(400, constants.error.ERROR_COUPON_USED, false);
            }
        } else {
            console.log("is cp exist: ", isCouponExist);
            // Xử lý trường hợp coupon không tồn tại
            return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExist);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCouponById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { coupon_id } = req.params;
        const user_id = Number(req.user_id);
        const isCouponExist = await configs.db.coupon.findFirst({
            where: {
                id: Number(coupon_id),
                is_delete: false,
                remain_quantity: {
                    gt: -1,
                },
            },
            include: {
                ratio: true,
            }
        });
        if (isCouponExist) {
            const isCouponUse = await configs.db.couponHistory.findFirst({
                where: {
                    coupon_id: isCouponExist.id,
                    user_id,
                    is_from_event: false,
                },
                include: {
                    coupon: true,
                },
            });

            if (isCouponUse && !isCouponUse.coupon.is_event) {
                // Đã sử dụng coupon và coupon không phải là event
                return new ResponseError(400, constants.error.ERROR_COUPON_USED, false);
            }
        } else {
            console.log("is cp exist: ", isCouponExist);
            // Xử lý trường hợp coupon không tồn tại
            return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExist);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getHistorySpinOfUserForAEvent = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { event_id } = req.params;
        const findHistorySpin = await configs.db.userEvent.findFirst({
            where: {
                user_id: user_id,
                event_id: Number(event_id),
            },
        });
        if (!findHistorySpin) return new ResponseError(404, constants.error.ERROR_HISTORY_SPIN_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, findHistorySpin);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getVoucherBySpin = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const allVoucherSpin = await configs.db.couponOwner.findMany({
            where: {
                user_id: user_id, // Giá trị user_id mà người dùng nhập vào
            },
            select: {
                quantity: true,
                coupon: {
                    select: {
                        code: true,
                        valid_start: true,
                        valid_until: true,
                        discount: true,
                    },
                },
            },
        });
        const validVouchers = allVoucherSpin.filter((voucher) => {
            const validUntilDate = new Date(voucher.coupon.valid_until);
            const currentDate = new Date();
            console.log(`Voucher valid until: ${validUntilDate}, Current date: ${currentDate}`);
            return validUntilDate >= currentDate;
        });
        
                const validVoucherData = validVouchers.map((voucherSpin) => ({
            code: voucherSpin.coupon.code,
            valid_start: voucherSpin.coupon.valid_start,
            valid_until: voucherSpin.coupon.valid_until,
            discount: voucherSpin.coupon.discount,
            quantity: voucherSpin.quantity,
        }));
        if (!allVoucherSpin) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, validVoucherData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createRatio = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const { coupon_id, ratio } = req.body;
        const isExistCoupon = await configs.db.coupon.findFirst({
            where: {
                id: coupon_id,
                event_id: {
                    not: null,
                },
            },
        });
        if (!isExistCoupon) return new ResponseError(400, constants.error.ERROR_COUPON_NOT_FOUND, false);
        const createRatio = await configs.db.ratio.create({
            data: {
                coupon_id: Number(coupon_id),
                ratio: ratio,
            },
        });
        if (!createRatio) return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, createRatio);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const updateRatio = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { ratio, coupon_id } = req.body;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isExistCoupon = await configs.db.coupon.findFirst({
            where: {
                id: coupon_id,
                event_id: {
                    not: null,
                },
            },
        });

        if (!isExistCoupon) {
            return new ResponseError(400, constants.error.ERROR_COUPON_NOT_FOUND, false);
        }

        // const isRatioExist = await configs.db.ratio.findUnique({
        //     where: {
        //         id: Number(ratio_id),
        //     },
        // });
        // if (!isRatioExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateRatio = await configs.db.ratio.update({
            data: {
                ratio: ratio,
            },
            where: {
                coupon_id: Number(coupon_id),
            },
        });
        if (!updateRatio) return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, updateRatio);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteRatio = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const { coupon_id } = req.body;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const isCouponRatioExist = await configs.db.ratio.findUnique({
            where: {
                coupon_id: Number(coupon_id),
            },
        });
        if (!isCouponRatioExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteRatio = await configs.db.ratio.delete({
            where: {
                coupon_id: Number(coupon_id),
            },
        });
        if (!deleteRatio) return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true, deleteRatio);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const couponService = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponByCode,
    GetCouponsWithPagination,
    getAllEventCoupon,
    getAllEventCouponByEventId,
    getCouponHistoryByUserId,
    getAllCouponHistory,
    createCouponOwner,
    getCouponByIdOnDate,
    getCouponById,
    getHistorySpinOfUserForAEvent,
    getVoucherBySpin,
    createHistoryForGoodLuckNextTime,
    createRatio,
    updateRatio,
    deleteRatio,
};
export default couponService;
