import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { Prisma } from "@prisma/client";
import constants from "../constants";

const addCourseToCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { course_id } = req.body;
        const courseId = Number(course_id);
        const isFoundCourse = await configs.db.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const isCartExist = await configs.db.cart.findFirst({
                where: {
                    user_id: userId,
                },
            });
            let cartId = 0;
            if (!isCartExist) {
                const createCart = await configs.db.cart.create({
                    data: {
                        user_id: userId,
                    },
                });
                cartId = createCart.id;
            } else {
                cartId = isCartExist.id;
            }
            const isEnrolled = await configs.db.enrolled.findFirst({
                where: {
                    user_id: userId,
                    course_id: courseId,
                },
            });
            const isExistInCart = await configs.db.cartDetail.findFirst({
                where: {
                    course_id: courseId,
                    cart_id: cartId,
                },
            });
            if (isExistInCart) return new ResponseError(400, constants.error.ERROR_ALREADY_IN_CART, false);
            else if (isEnrolled) return new ResponseError(400, constants.error.ERROR_ALREADY_ENROLLED, false);
            else {
                const addCourseToCart = await configs.db.cartDetail.create({
                    data: {
                        course_id: courseId,
                        cart_id: cartId,
                    },
                });
                if (addCourseToCart) return new ResponseSuccess(200, constants.success.SUCCESS_ADD_CART, true);
                else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const removeCourseFromCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        } else {
            cartId = isCartExist.id;
        }
        const isExistInCart = await configs.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart) return new ResponseError(400, constants.error.ERROR_COURSE_NOT_FOUND_IN_CART, false);
        else {
            const removeCourseFromCart = await configs.db.cartDetail.delete({
                where: {
                    id: isExistInCart.id,
                },
            });
            if (removeCourseFromCart) return new ResponseSuccess(200, constants.success.SUCCESS_REMOVE_CART, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changeSaveForLater = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { cart_detail_id } = req.params;
        const cartDetailId = Number(cart_detail_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        } else {
            cartId = isCartExist.id;
        }

        const isExistInCart = await configs.db.cartDetail.findFirst({
            where: {
                id: cartDetailId,
                cart_id: cartId,
            },
        });
        if (!isExistInCart) return new ResponseError(400, constants.error.ERROR_COURSE_NOT_FOUND_IN_CART, false);
        else {
            const changeSaveForLater = await configs.db.cartDetail.update({
                where: {
                    id: isExistInCart.id,
                },
                data: {
                    saved_for_later: !isExistInCart.saved_for_later,
                },
            });
            if (changeSaveForLater) return new ResponseSuccess(200, constants.success.SUCCESS_SAVE_FOR_LATER, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAllCart = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });
        let cartId = 0;
        if (!isCartExist) {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            cartId = createCart.id;
        } else {
            cartId = isCartExist.id;
        }

        const getAllCart = await configs.db.cartDetail.findMany({
            where: {
                cart_id: cartId,
                course: {
                    is_delete: false,
                },
            },
            include: {
                course: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const cart_items = getAllCart.map((cartDetail) => {
            const course = {
                course_id: cartDetail.course.id,
                title: cartDetail.course.title,
                slug: cartDetail.course.slug,
                thumbnail: cartDetail.course.thumbnail,
                average_rating: cartDetail.course.average_rating,
                number_of_rating: cartDetail.course.number_of_rating,
                number_of_enrolled: cartDetail.course.number_of_enrolled,
                author: cartDetail.course.user,
                price: cartDetail.course.price,
                sale_price: cartDetail.course.sale_price,
                sale_until: cartDetail.course.sale_until,
            };
            const cart_item = {
                cart_detail_id: cartDetail.id,
                saved_for_later: cartDetail.saved_for_later,
                course,
            };
            return cart_item;
        });
        const data = {
            cart_id: cartId,
            cart_items,
        };
        if (!getAllCart) return new ResponseError(400, constants.error.ERROR_CART_NOT_FOUND, false);
        else {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_CART, true, data);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const cartSerives = { addCourseToCart, removeCourseFromCart, changeSaveForLater, getAllCart };
export default cartSerives;
