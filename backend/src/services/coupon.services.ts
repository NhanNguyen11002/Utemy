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
        const isEvent = req.body.is_event === "true";
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
                discount: discount,
                valid_start: validStart,
                valid_until: validUntil,
                remain_quantity: remainQuantity,
                is_event: isEvent,
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
        const remainQuantity = Number(req.body.remain_quantity);
        const isEvent = req.body.is_event === "true";
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
                discount: discount,
                valid_start: validStart,
                valid_until: validUntil,
                remain_quantity: remainQuantity,
                is_event: isEvent,
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
        const couponOwner = await configs.db.couponOwner.findFirst({
            where: {
                quantity: {
                    gt: 0,
                },
                coupon: {
                    code: code,
                    is_delete: false,
                },
            },
            include: {
                coupon: true,
            },
        });

        if (couponOwner) {
            // Nếu có dữ liệu trong bảng coupon_owner, trả về thông tin coupon
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, couponOwner.coupon);
        } else {
            // Nếu không có dữ liệu trong bảng coupon_owner, tiếp tục kiểm tra trong bảng coupon
            const isCouponExsist = await configs.db.coupon.findFirst({
                where: {
                    code,
                    is_delete: false,
                    is_event: false,
                    valid_until: {
                        gt: new Date(),
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
                },
            });

            if (isCouponExsist) {
                return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, isCouponExsist);
            } else {
                // Xử lý trường hợp coupon không tồn tại
                return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
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
const createCouponOwner = async (req: IRequestWithId, coupon_id: number): Promise<ResponseBase> => {
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
            },
        });

        if (!existingCouponOwner) {
            // Tạo mới dữ liệu cho coupon_owner nếu chưa tồn tại
            const createNewOwner = await configs.db.couponOwner.create({
                data: {
                    coupon_id: coupon_id,
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
            if (createNewOwner && updateCoupon) console.log(createNewOwner);
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, createNewOwner);
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
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
            if (updateOwner && updateCoupon)
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, updateOwner);
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
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
const getCouponById = async (req: IRequestWithId): Promise<ResponseBase> => {
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
        });
        if (isCouponExist) {
            const isCouponUse = await configs.db.couponHistory.findFirst({
                where: {
                    coupon_id: isCouponExist.id,
                    user_id,
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
const couponService = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponByCode,
    GetCouponsWithPagination,
    getAllEventCoupon,
    getCouponHistoryByUserId,
    getAllCouponHistory,
    createCouponOwner,
    getCouponById,
};
export default couponService;
