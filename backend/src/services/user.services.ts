import { IRequestWithId } from "~/types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { OutstandingCourse } from "src/types/course";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { PagingResponse } from "../types/response";
import constants from "../constants";
import helper from "../helper";
import { User } from "../types/user";
import bcrypt from "bcrypt";

const getProfile = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
                is_deleted: false,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                email: true,
                is_admin: true,
            },
        });

        if (!user) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const updateProfile = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { first_name, last_name, description } = req.body;
        const user = await db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (!user) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        const isUpdate = await db.user.update({
            where: {
                id: req.user_id,
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                description: description,
            },
        });
        if (!isUpdate) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, false); //Missing Request body
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getAuthorProfile = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const user_id = parseInt(id);
        const user = await db.user.findFirst({
            where: {
                id: user_id,
                is_verify: true,
                is_deleted: false,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                id: true,
                is_admin: true,
                courses: {
                    where: {
                        is_delete: false,
                    },
                    include: {
                        course_categories: {
                            select: {
                                Category: {
                                    select: {
                                        id: true,
                                        title: true,
                                        url_image: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);

        const courses: OutstandingCourse[] = [];

        user?.courses.map((course) => {
            const data: OutstandingCourse = {
                course_id: course.id,
                thumbnail: course.thumbnail,
                title: course.title,
                slug: course.slug,
                number_of_enrolled: course.number_of_enrolled,
                number_of_rating: course.number_of_rating,
                categories: course.course_categories.map((cate) => (cate as any).Category),
                author: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_id: user.id,
                },
                created_at: course.created_at,
                updated_at: course.updated_at,
                average_rating: course.average_rating,
                status: course.status,
            };
            courses.push(data);
        });

        const data = {
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                url_avatar: user.url_avatar,
                description: user.description,
                is_admin: user.is_admin,
            },
            courses: courses,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const changeAvatar = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;

        const isExistUser = await configs.db.user.findFirst({
            where: {
                id: req.user_id,
            },
        });
        if (!isExistUser) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        else {
            let oldAvatarPath = "";
            if (isExistUser.url_avatar) oldAvatarPath = helper.ConvertHelper.deConvertFilePath(isExistUser.url_avatar);
            if (file) {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const changeAvatarUser = await configs.db.user.update({
                    where: {
                        id: req.user_id,
                    },
                    data: {
                        url_avatar: fullpathConverted,
                    },
                });
                if (changeAvatarUser) {
                    await helper.FileHelper.destroyedFileIfFailed(oldAvatarPath as string);
                    return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_AVATAR, true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path);
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_BAD_REQUEST, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllUsers = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, search_item: searchItem, role } = req.query;
        const { user_id: userId } = req;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: Number(userId),
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const parsePageIndex = Number(pageIndex);
        const parsedPageIndex = isNaN(parsePageIndex) ? 1 : parsePageIndex;
        const parsedSearchItem = searchItem as string;
        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        let searchUserData;
        if (role === "All") {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
            };
        } else {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
                is_admin: role === "Admin" ? true : false,
            };
        }

        const users = await configs.db.user.findMany({
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            where: searchUserData,
        });

        const totalRecord = await db.user.count({
            where: searchUserData,
        });

        const totalPage = Math.ceil(totalRecord / take);

        const usersData: User[] = users.map((user) => {
            return {
                user_id: user.id,
                description: user.description as string,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url_avatar: user.url_avatar as string,
                is_admin: user.is_admin,
                is_delete: user.is_deleted,
                created_at: user.created_at.toString(),
            };
        });

        const responseData: PagingResponse<User[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: usersData,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, responseData);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createNewUser = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { first_name, last_name, email, password, is_admin } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const hashedPassword = await bcrypt.hash(password, configs.general.HASH_SALT);
        const createUser = await configs.db.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                is_admin,
                is_verify: true,
            },
        });
        if (createUser) return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editUser = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, is_admin } = req.body;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs.db.user.update({
            data: {
                first_name,
                last_name,
                email,
                is_admin,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteUser = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs.db.user.update({
            data: {
                is_deleted: true,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const activeUser = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const createUser = await configs.db.user.update({
            data: {
                is_deleted: false,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const UserServices = {
    changeAvatar,
    getProfile,
    updateProfile,
    getAuthorProfile,
    getAllUsers,
    createNewUser,
    deleteUser,
    editUser,
    activeUser,
};
export default UserServices;
