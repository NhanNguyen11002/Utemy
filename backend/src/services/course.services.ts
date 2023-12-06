import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { generateUniqueSlug } from "../utils/helper";
import { Prisma } from "@prisma/client";
import constants from "../constants";
import helper from "../helper";
import { Rating } from "../types/rating.type";
import {
    CourseDetail,
    Category,
    CourseEdit,
    OutstandingCourse,
    CourseInfo,
    CourseCard,
    CourseOrderByWithRelationInput,
} from "../types/course";
import { PagingResponse } from "../types/response";
import { title } from "process";
import { Section } from "../types/section";
import { create } from "domain";
const getRightOfCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const course_id = parseInt(req.params.course_id);
        const isAuthor = await configs.db.course.findFirst({
            where: {
                id: course_id,
                author_id: user_id,
            },
        });
        if (isAuthor) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Author" });
        }
        const isEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: course_id,
                user_id: user_id,
            },
        });
        if (isEnrolled) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Enrolled" });
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { role: "Unenrolled" });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const addPromotion = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { sale_price, sale_until, course_id } = req.body;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: course_id,
                author_id: user_id,
            },
        });
        if (isFoundCourse) {
            if (isFoundCourse.price < sale_price)
                return new ResponseError(500, constants.error.ERROR_SALE_MORE_EXP_THAN_PRICE, false);
            const isAddPromotion = await configs.db.course.update({
                data: {
                    sale_price: Number(sale_price),
                    sale_until,
                },
                where: {
                    id: isFoundCourse.id,
                },
            });
            if (isAddPromotion) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(500, constants.error.ERROR_COURSE_NOT_FOUND, false);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const stopPromotion = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = req.user_id;
        const { course_id } = req.params;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                author_id: user_id,
            },
        });
        if (isFoundCourse) {
            const isStopPromotion = await configs.db.course.update({
                data: {
                    sale_price: isFoundCourse.price,
                    sale_until: new Date(),
                },
                where: {
                    id: isFoundCourse.id,
                },
            });
            if (isStopPromotion) return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
            else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else return new ResponseError(500, constants.error.ERROR_COURSE_NOT_FOUND, false);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const file = req.file;
    const { title, slug, description, summary, categories, status, price, requirement, study } = req.body;
    const user_id = req.user_id;
    try {
        let fullPathConverted = "";
        if (file) fullPathConverted = helper.ConvertHelper.convertFilePath(file.path);
        const listCategoryId = categories.split(",").map((item: number) => ({
            category_id: Number(item),
        }));
        const convertedStatus = status === "true" ? true : false;
        const uniqueSlug = generateUniqueSlug(slug);
        if (user_id) {
            const isCreateCourse = await db.course.create({
                data: {
                    title: title,
                    slug: uniqueSlug,
                    description: description,
                    summary: summary,
                    thumbnail: fullPathConverted,
                    author_id: user_id,
                    status: convertedStatus,
                    price: Number(price),
                    sale_price: Number(price),
                    course_categories: {
                        create: listCategoryId,
                    },
                    study,
                    requirement,
                },
                include: {
                    user: true, // Liên kết tới bảng User
                    enrolleds: true, // Liên kết tới bảng Enrolled
                    ratings: true, // Liên kết tới bảng Rating
                    sections: {
                        include: {
                            Lesson: true, // Liên kết tới bảng Lesson bên trong bảng Section
                        },
                    },
                },
            });
            if (isCreateCourse) {
                return new ResponseSuccess(201, constants.success.SUCCESS_CREATE_DATA, true);
            }
        }
        return new ResponseError(400, constants.error.ERROR_CREATE_COURSE_FAILED, false);
    } catch (error) {
        console.log("Lỗi create", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const editCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const file = req.file;
    const { course_id, title, slug, summary, description, categories, status, price, requirement, study } = req.body;
    try {
        const isFoundCourseById = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                is_delete: false,
            },
        });
        const convertedStatus = status === "true" ? true : false;
        if (!isFoundCourseById) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }

        if (file) {
            const oldThumbnailPath = helper.ConvertHelper.deConvertFilePath(isFoundCourseById.thumbnail);
            const fullPathConverted = helper.ConvertHelper.convertFilePath(file.path);
            const updatedCourse = await configs.db.course.update({
                where: {
                    id: Number(course_id),
                },
                data: {
                    title: title,
                    slug: slug,
                    summary: summary,
                    description: description,
                    status: convertedStatus,
                    thumbnail: fullPathConverted,
                    price: Number(price),
                    requirement,
                    study,
                },
            });
            if (!updatedCourse) {
                helper.FileHelper.destroyedFileIfFailed(file.path);
                return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
            } else {
                helper.FileHelper.destroyedFileIfFailed(oldThumbnailPath);
            }
        } else {
            const updatedCourse = await configs.db.course.update({
                where: {
                    id: Number(course_id),
                },
                data: {
                    title: title,
                    slug: slug,
                    summary: summary,
                    description: description,
                    status: convertedStatus,
                    price: Number(price),
                    requirement,
                    study,
                },
            });
            if (!updatedCourse) {
                return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
            }
        }
        await db.courseCategory.deleteMany({
            where: { course_id: Number(course_id) },
        });
        const isUpdateCategory = await db.courseCategory.createMany({
            data: categories.split(",").map((category: number) => ({
                course_id: Number(course_id),
                category_id: Number(category),
            })),
        });
        if (!isUpdateCategory) return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const deleteCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        // Check if the course exists
        const existingCourse = await db.course.findUnique({
            where: {
                id: Number(course_id),
            },
        });

        if (!existingCourse) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }

        // Set is_delete field to true to mark the course as deleted
        await db.course.update({
            where: {
                id: Number(course_id),
            },
            data: {
                is_delete: true,
            },
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const buyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop10RateCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const top10Courses = await configs.db.course.findMany({
            take: 10,
            where: {
                is_delete: false,
                status: true,
            },
            orderBy: {
                average_rating: "desc",
            },
            include: {
                course_categories: {
                    include: {
                        Category: {
                            select: {
                                id: true,
                                title: true,
                                url_image: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        // Định dạng dữ liệu theo cấu trúc yêu cầu
        const formattedData = top10Courses.map((course) => {
            const tempCate = course.course_categories.map((cc) => {
                const temp = {
                    category_id: cc.Category.id,
                    title: cc.Category.title,
                    url_image: cc.Category.url_image,
                };
                return temp;
            });
            const formatCourse = {
                course_id: course.id,
                title: course.title,
                summary: course.summary,
                thumbnail: course.thumbnail,
                average_rating: course.average_rating,
                number_of_rating: course.number_of_rating,
                number_of_enrolled: course.number_of_enrolled,
                author: {
                    user_id: course.user.id,
                    first_name: course.user.first_name,
                    last_name: course.user.last_name,
                },
                slug: course.slug,
                categories: tempCate,
                price: course.price,
                sale_price: course.sale_price,
                sale_until: course.sale_until,
            };
            return formatCourse;
        });
        if (top10Courses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 10 khóa học
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getTop10EnrolledCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const top10Courses = await configs.db.course.findMany({
            take: 10,
            where: {
                is_delete: false,
                status: true,
            },
            orderBy: {
                number_of_enrolled: "desc",
            },
            include: {
                course_categories: {
                    include: {
                        Category: {
                            select: {
                                id: true,
                                title: true,
                                url_image: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
            },
        });
        // Định dạng dữ liệu theo cấu trúc yêu cầu
        const formattedData = top10Courses.map((course) => {
            const tempCate = course.course_categories.map((cc) => {
                const temp = {
                    category_id: cc.Category.id,
                    title: cc.Category.title,
                    url_image: cc.Category.url_image,
                };
                return temp;
            });
            const formatCourse = {
                course_id: course.id,
                title: course.title,
                summary: course.summary,
                thumbnail: course.thumbnail,
                average_rating: course.average_rating,
                number_of_rating: course.number_of_rating,
                number_of_enrolled: course.number_of_enrolled,
                author: {
                    user_id: course.user.id,
                    first_name: course.user.first_name,
                    last_name: course.user.last_name,
                },
                slug: course.slug,
                categories: tempCate,
                price: course.price,
                sale_price: course.sale_price,
                sale_until: course.sale_until,
            };
            return formatCourse;
        });
        // Đảm bảo top10Courses có dữ liệu
        if (top10Courses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 10 khóa học
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const searchMyCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const { user_id: userId } = req;

        const parsePageIndex = Number(pageIndex);
        const parsedPageIndex = isNaN(parsePageIndex) ? 1 : parsePageIndex;
        const parsedSearchItem = searchItem as string;

        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        const courses = await configs.db.course.findMany({
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            where: {
                title: {
                    contains: parsedSearchItem,
                },
                author_id: userId,
                is_delete: false,
            },
            include: {
                user: true,
                course_categories: {
                    include: {
                        Category: true,
                    },
                },
                ratings: {
                    include: {
                        User: true,
                    },
                },
                sections: true,
                enrolleds: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const totalRecord = await db.course.count({
            where: {
                title: {
                    contains: parsedSearchItem,
                },
                author_id: userId,
                is_delete: false,
            },
        });

        const totalPage = Math.ceil(totalRecord / take);

        const courseCard: CourseInfo[] = (courses as any).map((data: any) => {
            return {
                course_id: data.id,
                title: data.title,
                status: data.status,
                summary: data.summary,
                thumbnail: data.thumbnail,
                average_rating: data.average_rating,
                number_of_rating: data.number_of_rating,
                number_of_enrolled: data.number_of_enrolled,
                author: {
                    user_id: data.user.id,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                },
                price: data.price,
                created_at: data.created_at,
                slug: data.slug,
                category: (data.course_categories as any).map((cc: any) => {
                    return {
                        id: cc.Category?.id,
                        title: cc.Category?.title,
                        url_image: cc.Category?.url_image,
                    };
                }),
            };
        });

        const responseData: PagingResponse<CourseInfo[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: courseCard,
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

const searchMyEnrolledCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const { user_id: userId } = req;
        const parsePageIndex = Number(pageIndex);
        const parsedPageIndex = isNaN(parsePageIndex) ? 1 : parsePageIndex;
        const parsedSearchItem = searchItem as string;

        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        const enrolledCourses = await configs.db.enrolled.findMany({
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            where: {
                course: {
                    title: {
                        contains: parsedSearchItem,
                    },
                    is_delete: false,
                },
                user_id: userId,
            },
            include: {
                course: {
                    include: {
                        user: true,
                        course_categories: {
                            include: {
                                Category: true,
                            },
                        },
                        sections: true,
                        enrolleds: true,
                    },
                },
            },
        });
        if (!enrolledCourses) {
            // Xử lý trường hợp enrolledCourses là undefined hoặc null
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        const totalRecord = await db.enrolled.count({
            where: {
                course: {
                    title: {
                        contains: parsedSearchItem,
                    },
                },
                user_id: userId,
            },
        });

        const totalPage = Math.ceil(totalRecord / take);

        const courseCard: CourseInfo[] = (enrolledCourses as any).map((enroll: any) => {
            return {
                course_id: enroll.course?.id,
                title: enroll.course?.title,
                summary: enroll.course?.summary,
                thumbnail: enroll.course?.thumbnail,
                number_of_rating: enroll.course?.number_of_rating,
                number_of_enrolled: enroll.course?.number_of_enrolled,
                average_rating: enroll.course?.average_rating,
                created_at: enroll.course.created_at,
                number_of_section: enroll.course.sections.length,
                author: {
                    user_id: enroll.course?.user.id,
                    first_name: enroll.course?.user.first_name,
                    last_name: enroll.course?.user.last_name,
                },
                slug: enroll.course?.slug,
                category: (enroll.course?.course_categories as any).map((cc: any) => {
                    return {
                        id: cc.Category?.id,
                        title: cc.Category?.title,
                        url_image: cc.Category?.url_image,
                    };
                }),
            };
        });

        const responseData: PagingResponse<CourseInfo[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: courseCard,
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
const getAllCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const pageIndex: number | undefined = req.query.page_index
            ? parseInt(req.query.page_index as string, 10)
            : undefined;
        const searchItem: string | undefined = req.query.search_item ? (req.query.search_item as string) : undefined;
        const category: string[] | string | undefined = req.query.category
            ? Array.isArray(req.query.category)
                ? (req.query.category as string[])
                : [req.query.category as string]
            : undefined;
        const sortBy: string | undefined = req.query.sort_by ? (req.query.sort_by as string) : undefined;
        const evaluate: number | undefined = req.query.evaluate ? parseFloat(req.query.evaluate as string) : undefined;
        const take = configs.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * take;
        const categoriesConvert = category?.map((item: string) => Number(item));
        const orderBy: CourseOrderByWithRelationInput = {};
        if (sortBy === "oldest") {
            orderBy.created_at = "asc";
        } else if (sortBy === "attendees") {
            orderBy.enrolleds = { _count: "desc" };
        } else if (sortBy === "ascprice") {
            orderBy.price = "asc";
        } else if (sortBy === "descprice") {
            orderBy.price = "desc";
        } else {
            orderBy.created_at = "desc";
        }
        const categoriesFilter = categoriesConvert?.map((item: number) => {
            return {
                course_categories: {
                    some: {
                        Category: {
                            id: item,
                        },
                    },
                },
            };
        });

        const baseFilter: any = {
            is_delete: false,
            status: true,
        };

        if (searchItem && searchItem !== "undefined") {
            baseFilter.title = {
                contains: searchItem.toLowerCase(),
            };
        }

        if (categoriesConvert) {
            baseFilter.AND = categoriesFilter;
        }

        if (evaluate) {
            baseFilter.average_rating = {
                gte: evaluate - 1,
                lt: evaluate, // nếu rating truyền vào là 3, thì login ở đây sẽ filter rating >2 và <=3
            };
        }
        const totalRecord = await db.course.count({
            where: baseFilter,
        });

        const courseCardData = await configs.db.course.findMany({
            include: {
                user: true,
                course_categories: {
                    include: {
                        Category: true,
                    },
                },
            },
            skip,
            take,
            orderBy,
            where: baseFilter,
        });
        const totalPage = Math.ceil(totalRecord / take);
        if (!courseCardData) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }

        const courseCard: CourseCard[] = (courseCardData as any).map((data: any) => {
            return {
                course_id: data.id,
                title: data.title,
                summary: data.summary,
                thumbnail: data.thumbnail,
                number_of_rating: data.number_of_rating,
                average_rating: data.average_rating,
                number_of_enrolled: data.number_of_enrolled,
                created_at: data.created_at,
                price: data.price,
                sale_price: data.sale_price,
                sale_until: data.sale_until,
                status: data.status,
                author: {
                    user_id: data.user.id,
                    first_name: data.user.first_name,
                    last_name: data.user.last_name,
                },
                slug: data.slug,
                category: (data.course_categories as any).map((cc: any) => {
                    return {
                        id: cc.Category?.id,
                        title: cc.Category?.title,
                        url_image: cc.Category?.url_image,
                    };
                }),
            };
        });
        const responseData: PagingResponse<CourseCard[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: courseCard,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, responseData);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getCourseDetail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const course = await db.course.findFirst({
            where: {
                slug: slug,
            },
            include: {
                course_categories: {
                    include: {
                        Category: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                sections: {
                    select: {
                        title: true,
                        updated_at: true,
                        id: true,
                        Lesson: {
                            where: {
                                is_delete: false,
                            },
                            select: {
                                id: true,
                                title: true,
                                url_video: true,
                                duration: true,
                                description: true,
                            },
                            orderBy: {
                                created_at: "asc",
                            },
                        },
                    },
                    where: {
                        is_delete: false,
                    },
                },
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        id: true,
                    },
                },
            },
        });

        if (course) {
            if (course.is_delete) {
                return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            } else {
                const categories: Category[] = [];
                course.course_categories.forEach((category) => {
                    categories.push(category.Category as any);
                });
                const author = { ...course.user, user_id: course.user.id };
                const sections: Section[] = course.sections;
                let number_of_section = 0;
                sections.forEach((section, index) => {
                    number_of_section += 1;
                });
                const courseData: CourseDetail = {
                    course_id: course.id,
                    title: course.title,
                    summary: course.summary,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    average_rating: course.average_rating,
                    number_of_rating: course.number_of_rating,
                    number_of_enrolled: course.number_of_enrolled,
                    author: author,
                    number_of_section,
                    categories: categories,
                    sections: sections,
                    status: course.status,
                    price: course.price,
                    sale_price: course.sale_price,
                    sale_until: course.sale_until,
                    slug: course.slug,
                    updated_at: course.updated_at.toString(),
                    requirement: JSON.parse(course.requirement as string),
                    study: JSON.parse(course.study as string),
                };
                return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, courseData);
            }
        }
        return new ResponseError(404, constants.error.ERROR_GET_COURSE_FAILED, false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCourseDetailById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const course = await db.course.findUnique({
            where: {
                id: Number(course_id),
            },
            include: {
                course_categories: {
                    include: {
                        Category: {
                            select: {
                                id: true,
                                title: true,
                                url_image: true,
                            },
                        },
                    },
                },
                sections: {
                    select: {
                        title: true,
                        updated_at: true,
                        id: true,
                        Lesson: {
                            where: {
                                is_delete: false,
                            },
                            select: {
                                id: true,
                                title: true,
                                url_video: true,
                                duration: true,
                                description: true,
                            },
                            orderBy: {
                                created_at: "asc",
                            },
                        },
                    },
                    where: {
                        is_delete: false,
                    },
                },
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        id: true,
                    },
                },
            },
        });

        if (course) {
            if (course.is_delete) {
                return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            } else {
                const categories: Category[] = [];
                course.course_categories.forEach((category) => {
                    const temp: Category = {
                        category_id: category.Category.id,
                        title: category.Category.title,
                        url_image: category.Category.url_image,
                    };
                    categories.push(temp);
                });
                const author = { ...course.user, user_id: course.user.id };
                const sections: Section[] = course.sections;
                const courseData: CourseDetail = {
                    course_id: course.id,
                    title: course.title,
                    summary: course.summary,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    average_rating: course.average_rating,
                    number_of_rating: course.number_of_rating,
                    number_of_enrolled: course.number_of_enrolled,
                    author: author,
                    categories: categories,
                    sections: sections,
                    status: course.status,
                    price: course.price,
                    sale_price: course.sale_price,
                    sale_until: course.sale_until,
                    slug: course.slug,
                    requirement: JSON.parse(course.requirement as string),
                    study: JSON.parse(course.study as string),
                };

                return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, courseData);
            }
        }
        return new ResponseError(404, constants.error.ERROR_GET_COURSE_FAILED, false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const changeThumbnail = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const file = req.file;
        const { course_id } = req.body;
        if (file) {
            const isCourseExist = await configs.db.course.findFirst({
                where: {
                    id: course_id,
                    is_delete: false,
                },
            });
            if (!isCourseExist) {
                return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
            } else {
                if (isCourseExist.author_id !== req.user_id) {
                    return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
                } else {
                    const oldThumbnailPath = isCourseExist.thumbnail;
                    const changeThumbnail = await configs.db.course.update({
                        where: {
                            id: course_id,
                        },
                        data: {
                            thumbnail: file.path,
                        },
                    });
                    if (changeThumbnail) {
                        await helper.FileHelper.destroyedFileIfFailed(oldThumbnailPath as string);
                        return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_THUMBNAIL, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                }
            }
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getListRatingOfCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const { page_index: pageIndex, score } = req.query;
        const { slug } = req.params;
        const pageSize = 5;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                slug: slug,
                is_delete: false,
            },
            select: {
                id: true,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            let baseFilter: any = {
                course_id: isFoundCourse.id,
            };
            if (Number(score) !== 0) {
                baseFilter = {
                    ...baseFilter,
                    score: Number(score),
                };
            }
            const ratingList = await configs.db.rating.findMany({
                skip: pageSize * (Number(pageIndex) - 1),
                take: pageSize,
                where: baseFilter,
                include: {
                    User: {
                        select: {
                            url_avatar: true,
                            first_name: true,
                            last_name: true,
                            id: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            });

            const totalRecord = await configs.db.rating.count({
                where: baseFilter,
            });
            const ratingListData: Rating[] = [];
            ratingList.map((item) => {
                const rating: Rating = {
                    id: item.id,
                    user_id: item.user_id,
                    first_name: item.User.first_name,
                    last_name: item.User.last_name,
                    url_avatar: item.User.url_avatar,
                    score: item.score,
                    content: item.content,
                    created_at: item.created_at.toString(),
                };
                return ratingListData.push(rating);
            });
            const totalPage = Math.ceil(totalRecord / pageSize);
            const ratingListResponseData = {
                total_record: totalRecord,
                total_page: totalPage,
                data: ratingListData,
            };

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, ratingListResponseData);
        }
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getRatingPercentOfCourse = async (req: Request): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                slug: slug,
                is_delete: false,
            },
            select: {
                id: true,
                number_of_rating: true,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        else {
            const ratingCountPerScore: any[] = await configs.db
                .$queryRaw`select count(id) as rating_count, score from rating where rating.course_id = ${isFoundCourse.id}  group by score  order by score desc;`;
            const scoreThatHasPercent: Record<number | string, number> = ratingCountPerScore.reduce(
                (acc: any, rating: any) => {
                    acc[rating.score] = Number(
                        (Number(rating.rating_count) / isFoundCourse.number_of_rating) * 100,
                    ).toFixed(0);
                    return acc;
                },
                {},
            );
            const score = [5, 4, 3, 2, 1];
            const data = score.map((title) => {
                const temp = {
                    title: title,
                    percent: Number(scoreThatHasPercent[title]) || 0,
                };
                return temp;
            });

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const CourseServices = {
    getRightOfCourse,
    createCourse,
    editCourse,
    deleteCourse,
    buyCourse,
    getTop10RateCourse,
    getTop10EnrolledCourse,
    searchMyCourse,
    searchMyEnrolledCourse,
    getAllCourse,
    getCourseDetail,
    changeThumbnail,
    getListRatingOfCourse,
    getCourseDetailById,
    addPromotion,
    stopPromotion,
    getRatingPercentOfCourse,
};

export default CourseServices;
