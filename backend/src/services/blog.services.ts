import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DateTime } from "luxon";
import helper from "../helper";
import { BlogResponse } from "../types/blog.type";

const createBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const userId = req.user_id;
        const { title, content, categories } = req.body;

        if (file) {
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: userId,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            } else {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const listCategoryId = categories.split(",").map((item: number) => ({
                    category_id: Number(item),
                }));
                const createBlog = await configs.db.blog.create({
                    data: {
                        author_id: userId as number,
                        title: title,
                        content: content,
                        url_image: fullpathConverted,
                        created_at: new Date(),
                        updated_at: new Date(),
                        blog_categories: {
                            create: listCategoryId,
                        },
                    },
                });

                if (createBlog) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path as string);
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const updateBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { blog_id, title, content, categories, is_published } = req.body;
        const isPublishedBoolean = is_published === "true";
        const userId = req.user_id;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: parseInt(blog_id),
            },
        });
        if (!isBlogExist) {
            return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        } else {
            const isBlogUnique = await configs.db.blog.findFirst({
                where: {
                    title,
                    NOT: {
                        id: parseInt(blog_id),
                    },
                },
            });
            if (isBlogUnique) return new ResponseError(400, constants.error.ERROR_BLOG_ALREADY_EXISTS, false);
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: userId,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            } else {
                if (file) {
                    const oldBlogImagePath = helper.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                    const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                    const changeThumbnailBlog = await configs.db.blog.update({
                        where: {
                            id: parseInt(blog_id),
                        },
                        data: {
                            author_id: userId as number,
                            url_image: fullpathConverted,
                            title: title,
                            content: content,
                            updated_at: new Date(),
                            is_published: isPublishedBoolean,
                        },
                    });
                    const deleteOldCategory = await configs.db.blogCategory.deleteMany({
                        where: { blog_id: Number(blog_id) },
                    });
                    const isUpdateCategory = await configs.db.blogCategory.createMany({
                        data: categories.split(",").map((category: number) => ({
                            blog_id: Number(blog_id),
                            category_id: Number(category),
                        })),
                    });
                    if (changeThumbnailBlog && deleteOldCategory && isUpdateCategory) {
                        await helper.FileHelper.destroyedFileIfFailed(oldBlogImagePath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        await helper.FileHelper.destroyedFileIfFailed(file.path as string);
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                } else {
                    const updateBlog = await configs.db.blog.update({
                        where: {
                            id: parseInt(blog_id),
                        },
                        data: {
                            title: title,
                            content: content,
                            author_id: userId,
                            updated_at: new Date(),
                            is_published: isPublishedBoolean,
                        },
                    });
                    const deleteOldCategory = await configs.db.blogCategory.deleteMany({
                        where: { blog_id: Number(blog_id) },
                    });
                    const isUpdateCategory = await configs.db.blogCategory.createMany({
                        data: categories.split(",").map((category: number) => ({
                            blog_id: Number(blog_id),
                            category_id: Number(category),
                        })),
                    });
                    if (updateBlog && deleteOldCategory && isUpdateCategory) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { blog_id } = req.params;
        const blogIdConvert = parseInt(blog_id);
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: blogIdConvert,
            },
        });
        if (!isBlogExist) {
            return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        } else {
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
            } else {
                const oldBlogImagePath = helper.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                const deleteBlog = await configs.db.blog.delete({
                    where: {
                        id: blogIdConvert,
                    },
                });
                if (deleteBlog) {
                    await helper.FileHelper.destroyedFileIfFailed(oldBlogImagePath as string);
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlogsWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const category: string[] | string | undefined = req.query.category
            ? Array.isArray(req.query.category)
                ? (req.query.category as string[])
                : [req.query.category as string]
            : undefined;
        const categoriesConvert = category?.map((item: string) => Number(item));
        const pageSize = configs.general.PAGE_SIZE;
        const categoriesFilter = categoriesConvert?.map((item: number) => {
            return {
                blog_categories: {
                    some: {
                        category: {
                            id: item,
                        },
                    },
                },
            };
        });
        const whereCondition: any = {
            title: {
                contains: searchItem?.toString(),
            },
        };

        // Nếu có categoriesFilter, thêm vào điều kiện `AND`
        if (categoriesFilter) {
            whereCondition.AND = categoriesFilter;
        }
        const getListBlogs = await configs.db.blog.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
            where: whereCondition,
            orderBy: {
                updated_at: "desc",
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const totalRecord = await configs.db.blog.count({
            where: whereCondition,
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const blog: BlogResponse = {
                blog_id: item.id,
                title: item.title,
                content: item.content,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: (item.blog_categories as any).map((cc: any) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });
        const blogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: blogs,
        };

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, blogsResponseData);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlogs = async (req: Request): Promise<ResponseBase> => {
    try {
        const getListBlogs = await configs.db.blog.findMany({
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                title: "asc",
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const blog: BlogResponse = {
                blog_id: item.id,
                title: item.title,
                content: item.content,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: (item.blog_categories as any).map((cc: any) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, blogs);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { blog_id } = req.params;

        const getBlog = await configs.db.blog.findFirst({
            where: {
                id: Number(blog_id),
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!getBlog) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const blog: BlogResponse = {
            blog_id: getBlog.id,
            title: getBlog.title,
            content: getBlog.content,
            url_image: getBlog.url_image,
            created_at: DateTime.fromISO(getBlog.created_at.toISOString()),
            updated_at: DateTime.fromISO(getBlog.updated_at.toISOString()),
            is_published: getBlog.is_published,
            author: {
                user_id: getBlog.user.id,
                first_name: getBlog.user.first_name,
                last_name: getBlog.user.last_name,
            },
            categories: (getBlog.blog_categories as any).map((cc: any) => {
                return {
                    id: cc.category?.id,
                    title: cc.category?.title,
                    url_image: cc.category?.url_image,
                };
            }),
        };

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, blog);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const blogService = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsWithPagination,
    getBlogs,
    getBlog,
};
export default blogService;
