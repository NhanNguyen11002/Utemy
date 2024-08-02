import { IRequestWithId } from "../types/request";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { DateTime } from "luxon";
import helper from "../helper";
import { BlogResponse } from "../types/blog.type";
import { generateUniqueSlug } from "../utils/helper";
import { ReactionType } from "@prisma/client";

const createBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const userId = req.user_id;
        const { title, slug } = req.body;
        const uniqueSlug = generateUniqueSlug(slug);

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

                const createBlog = await configs.db.blog.create({
                    data: {
                        author_id: userId as number,
                        title: title,
                        content: "",
                        slug: uniqueSlug,
                        url_image: fullpathConverted,
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
        const { blog_id, title, content, categories } = req.body;
        const userId = req.user_id;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: parseInt(blog_id),
            },
        });
        if (!isBlogExist) {
            return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        } else {
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
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const togglePublishedBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const { published } = req.body;
        const convertPublished = published === "true" || published === true;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                slug,
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
                const toggle = await configs.db.blog.update({
                    where: {
                        slug,
                    },
                    data: {
                        is_published: convertPublished,
                    },
                });
                if (toggle) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                slug,
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
                // const oldBlogImagePath = helper.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                const deleteBlog = await configs.db.blog.update({
                    where: {
                        slug,
                    },
                    data: {
                        is_deleted: true,
                    },
                });
                if (deleteBlog) {
                    // await helper.FileHelper.destroyedFileIfFailed(oldBlogImagePath as string);
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
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
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
            is_deleted: false,
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
                reactions_blog: {
                    select: {
                        type: true,
                        id: true,
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
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                like,
                dislike,
                view: item.view,
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
                reactions_blog: {
                    select: {
                        type: true,
                        id: true,
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
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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
const getBlogBySlug = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;

        const getBlog = await configs.db.blog.findFirst({
            where: {
                slug: slug,
                is_deleted: false,
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reactions_blog: {
                    select: {
                        type: true,
                        id: true,
                    },
                },
            },
        });
        if (!getBlog) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const reaction = getBlog.reactions_blog.length;
        const like = getBlog.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
        const dislike = reaction - like;
        const blog: BlogResponse = {
            like,
            dislike,
            view: getBlog.view,
            blog_id: getBlog.id,
            title: getBlog.title,
            content: getBlog.content,
            slug: getBlog.slug,
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
                    category_id: cc.category?.id,
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
const top10View = async (req: Request): Promise<ResponseBase> => {
    try {
        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reactions_blog: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                view: "desc",
            },
            where: {
                is_published: true,
                is_deleted: false,
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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
//
const top10Like = async (req: Request): Promise<ResponseBase> => {
    try {
        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reactions_blog: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            where: {
                is_published: true,
                is_deleted: false,
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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

        blogs.sort((a, b) => b.like - a.like);

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, blogs);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getNewestBlogWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex } = req.query;

        const pageSize = configs.general.PAGE_SIZE;
        const getListBlogs = await configs.db.blog.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            where: {
                is_deleted: false,
                is_published: true,
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reactions_blog: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const totalRecord = await configs.db.blog.count({
            where: {
                is_deleted: false,
                is_published: true,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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
const searchBlogUserWithPagination = async (req: IRequestWithId): Promise<ResponseBase> => {
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
            is_deleted: false,
            is_published: true,
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
                reactions_blog: {
                    select: {
                        id: true,
                        type: true,
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
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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
const top5RelatedBySlug = async (req: Request): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;

        const getBlog = await configs.db.blog.findFirst({
            where: {
                slug: slug,
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
        const categoryIds = getBlog.blog_categories.map((bc) => bc.category.id);

        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reactions_blog: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                view: "desc",
            },
            where: {
                id: {
                    not: getBlog.id,
                },
                blog_categories: {
                    some: {
                        category: {
                            id: {
                                in: categoryIds,
                            },
                        },
                    },
                },
                is_deleted: false,
                is_published: true,
            },
        });
        if (!getListBlogs) return new ResponseError(404, constants.error.ERROR_BLOG_NOT_FOUND, false);
        const blogs: BlogResponse[] = [];
        getListBlogs.map((item) => {
            const reaction = item.reactions_blog.length;
            const like = item.reactions_blog.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog: BlogResponse = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
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
const reactBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { blog_id, reaction_type } = req.body;
        const blogId = Number(blog_id);
        const convertReactionType = reaction_type === "like" ? ReactionType.LIKE : ReactionType.DISLIKE;
        const isExistReaction = await configs.db.reactionBlog.findFirst({
            where: {
                user_id: userId,
                blog_id: blogId,
            },
        });
        if (isExistReaction) {
            if (isExistReaction.type === convertReactionType) {
                const deleteReaction = await configs.db.reactionBlog.delete({
                    where: {
                        id: isExistReaction.id,
                    },
                });
                if (deleteReaction)
                    return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true, {
                        action: "delete",
                    });
            }
            const updateReaction = await configs.db.reactionBlog.update({
                where: {
                    id: isExistReaction.id,
                },
                data: {
                    type: convertReactionType,
                },
            });
            if (!updateReaction) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            else
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true, {
                    action: "update",
                    reaction_type,
                });
        } else {
            const createReaction = await configs.db.reactionBlog.create({
                data: {
                    user_id: userId,
                    blog_id: blogId,
                    type: convertReactionType,
                },
            });
            if (!createReaction) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            else
                return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, {
                    action: "create",
                    reaction_type,
                });
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getUserReactBySlug = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { slug } = req.params;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                slug,
            },
        });
        if (!isBlogExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isExistReaction = await configs.db.reactionBlog.findFirst({
            where: {
                user_id: userId,
                blog_id: isBlogExist.id,
            },
        });

        if (!isExistReaction) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const data = {
            react_type: isExistReaction.type === ReactionType.LIKE ? "like" : "dislike",
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const increaseViewBlog = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const increaseView = await configs.db.blog.update({
            where: {
                slug,
            },
            data: {
                view: {
                    increment: 1,
                },
            },
        });

        if (!increaseView) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const blogService = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsWithPagination,
    getBlogs,
    getBlogBySlug,
    togglePublishedBlog,
    searchBlogUserWithPagination,
    getNewestBlogWithPagination,
    top10Like,
    top10View,
    top5RelatedBySlug,
    reactBlog,
    getUserReactBySlug,
    increaseViewBlog,
};
export default blogService;
