import { IRequestWithId } from "../types/request";
import { db } from "../configs/db.config";
import express, { Request, Response } from "express";
import configs from "../configs";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { generateUniqueSlug } from "../utils/helper";
import { Prisma } from "@prisma/client";
import constants from "../constants";
import helper from "../helper";
import { v4 as uuidv4 } from "uuid";
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
import { Section } from "../types/section";
import { Lecture } from "../types/lecture";
import { number } from "joi";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { isFloat64Array } from "util/types";
import { Author } from "~/types/user";
import { resolutions } from "../common";
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
                    sale_until: new Date(sale_until),
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
    let fullPathConvertedThumbnail = "";
    let fullpathConvertedTrailer = "";
    const { title, slug, description, summary, categories, price, requirement, study } = req.body;
    const user_id = req.user_id;

    // Check if req.files exists and is an object
    if (req.files && typeof req.files === "object") {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Check if 'thumbnail' exists in files
        if ("thumbnail" in files) {
            const thumbnailFiles = files["thumbnail"];

            // Check if thumbnailFiles is an array and not empty
            if (Array.isArray(thumbnailFiles) && thumbnailFiles.length > 0) {
                const thumbnailFile = thumbnailFiles[0];
                console.log("Thumbnail file:", thumbnailFiles);
                console.log(thumbnailFile.path);
                fullPathConvertedThumbnail = helper.ConvertHelper.convertFilePath(thumbnailFile.path);
            } else {
                console.log("No thumbnail file uploaded.");
            }
        } else {
            console.log("No thumbnail file uploaded.");
        }

        // Check if 'trailer' exists in files
        if ("trailer" in files) {
            const trailerFiles = files["trailer"];

            // Check if trailerFiles is an array and not empty
            if (Array.isArray(trailerFiles) && trailerFiles.length > 0) {
                const trailerFile = trailerFiles[0];
                console.log("Trailer file:", trailerFile);
                const uuid = uuidv4();
                const createFile: any = await helper.FileHelper.createFileM3U8AndTS(
                    trailerFile,
                    resolutions,
                    configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                    `${slug}_${uuid}`,
                );
                if (!createFile) {
                    await helper.FileHelper.destroyedVideoIfFailed(createFile.urlVideo);
                } else {
                    fullpathConvertedTrailer = helper.ConvertHelper.convertFilePath(createFile.urlVideo);
                }
            } else {
                console.log("No trailer file uploaded.");
            }
        } else {
            console.log("No trailer file uploaded.");
        }
    } else {
        console.log("No files uploaded.");
    }

    try {
        const listCategoryId = categories.split(",").map((item: number) => ({
            category_id: Number(item),
        }));
        const uniqueSlug = generateUniqueSlug(slug);

        if (user_id) {
            const isCreateCourse = await db.course.create({
                data: {
                    title: title,
                    slug: uniqueSlug,
                    description: description,
                    summary: summary,
                    thumbnail: fullPathConvertedThumbnail,
                    author_id: user_id,
                    status: false,
                    price: Number(price),
                    sale_price: Number(price),
                    course_categories: {
                        create: listCategoryId,
                    },
                    study,
                    requirement,
                    url_trailer: fullpathConvertedTrailer,
                },
                include: {
                    user: true,
                    enrolleds: true,
                    ratings: true,
                    sections: {
                        include: {
                            Lecture: true,
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
        console.log("Error creating course:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const editCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    const { course_id, title, slug, summary, description, categories, price } = req.body;
    try {
        const isFoundCourseById = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                is_delete: false,
            },
        });
        if (!isFoundCourseById) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }

        if (req.files && typeof req.files === "object") {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const thumbnailFile = files["thumbnail"] ? files["thumbnail"][0] : undefined;
            const trailerFile = files["trailer"] ? files["trailer"][0] : undefined;

            // Update thumbnail if available
            if (thumbnailFile) {
                console.log("Thumbnail file:", thumbnailFile);
                const oldThumbnailPath = helper.ConvertHelper.deConvertFilePath(isFoundCourseById.thumbnail);
                const fullPathConvertedThumbnail = helper.ConvertHelper.convertFilePath(thumbnailFile.path);
                await configs.db.course.update({
                    where: { id: Number(course_id) },
                    data: {
                        title: title,
                        slug: slug,
                        summary: summary,
                        description: description,
                        thumbnail: fullPathConvertedThumbnail,
                        price: Number(price),
                    },
                });
                helper.FileHelper.destroyedFileIfFailed(oldThumbnailPath);
            }

            // Update trailer if available
            if (trailerFile) {
                console.log("Trailer file:", trailerFile);
                const uuid = uuidv4();
                const createFile: any = await helper.FileHelper.createFileM3U8AndTS(
                    trailerFile,
                    resolutions,
                    configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                    `${slug}_${uuid}`,
                );
                if (!createFile) {
                    await helper.FileHelper.destroyedVideoIfFailed(createFile.urlVideo);
                } else {
                    const oldTrailerPath = helper.ConvertHelper.deConvertFilePath(isFoundCourseById.thumbnail);
                    const fullpathConvertedTrailer = helper.ConvertHelper.convertFilePath(createFile.urlVideo);
                    await configs.db.course.update({
                        where: { id: Number(course_id) },
                        data: {
                            title: title,
                            slug: slug,
                            summary: summary,
                            description: description,
                            url_trailer: fullpathConvertedTrailer,
                            price: Number(price),
                        },
                    });
                    helper.FileHelper.destroyedFileIfFailed(oldTrailerPath);
                }
            }
        } else {
            console.log("No files uploaded.");
        }

        // Update other course details
        const updatedCourse = await configs.db.course.update({
            where: {
                id: Number(course_id),
            },
            data: {
                title: title,
                slug: slug,
                summary: summary,
                description: description,
                price: Number(price),
            },
        });

        if (!updatedCourse) {
            return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
        }

        // Update course categories
        await db.courseCategory.deleteMany({
            where: { course_id: Number(course_id) },
        });
        const isUpdateCategory = await db.courseCategory.createMany({
            data: categories.split(",").map((category: number) => ({
                course_id: Number(course_id),
                category_id: Number(category),
            })),
        });
        if (!isUpdateCategory) {
            return new ResponseError(400, constants.error.ERROR_MISSING_REQUEST_BODY, false);
        }

        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const updateTargetCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id, requirement, study } = req.body;
        // Check if the course existsc
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
                requirement: JSON.stringify(requirement),
                study: JSON.stringify(study),
            },
        });
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
                study: JSON.parse(course.study as string),
                updated_at: course.updated_at,
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
                updated_at: course.updated_at,
                study: JSON.parse(course.study as string),
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
                ratings: {
                    include: {
                        User: true,
                    },
                },
                sections: {
                    where: {
                        is_delete: false,
                    },
                    include: {
                        Lecture: {
                            select: {
                                id: true,
                                type: true,
                                lesson: true,
                                test: true,
                            },
                        },
                    },
                },
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
            const sections: Section[] = data.sections.map((section: any) => {
                const lecture = section.Lecture.map((lecture: any) => {
                    let content;
                    if (lecture.type === "Lesson") content = lecture.lesson;
                    else content = lecture.test;
                    const tempLecture: Lecture = {
                        lecture_id: lecture.id,
                        type: lecture.type,
                        content,
                    };
                    return tempLecture;
                });
                const temp: Section = {
                    title: section.title,
                    updated_at: section.updated_at,
                    id: section.id,
                    lecture,
                };
                return temp;
            });

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
                created_at: data.created_at,
                slug: data.slug,
                study: JSON.stringify(data.study),
                requirement: JSON.stringify(data.requirement),
                final_test_id: data.final_test_id,
                sections,
                description: data.description,
            };
        });

        const responseData: PagingResponse<CourseInfo[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: courseCard,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, responseData);
    } catch (error) {
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
                        sections: {
                            where: {
                                is_delete: false,
                            },
                            include: {
                                Lecture: {
                                    where: {
                                        is_delete: false,
                                    },
                                },
                            },
                        },
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
                    is_delete: false,
                },
                user_id: userId,
            },
        });

        const totalPage = Math.ceil(totalRecord / take);

        const courseCard: CourseInfo[] = (enrolledCourses as any).map(async (enroll: any) => {
            let number_of_lecture = 0;
            enroll.course.sections.forEach((section: any) => {
                number_of_lecture += section.Lecture.length;
            });

            let getOverall = 0;
            await configs.db.progress
                .count({
                    where: {
                        user_id: userId,
                        course_id: enroll.course.id,
                        pass: true,
                        is_delete: false,
                    },
                })
                .then((result) => {
                    getOverall = result;
                });
            return {
                course_id: enroll.course?.id,
                title: enroll.course?.title,
                summary: enroll.course?.summary,
                thumbnail: enroll.course?.thumbnail,
                number_of_rating: enroll.course?.number_of_rating,
                number_of_enrolled: enroll.course?.number_of_enrolled,
                average_rating: enroll.course?.average_rating,
                updated_at: enroll.course.updated_at,
                number_of_section: enroll.course.sections.length,
                number_of_lecture,
                overall_progress: getOverall,
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
        const data = await Promise.all(courseCard);
        const responseData: PagingResponse<CourseInfo[]> = {
            total_page: totalPage,
            total_record: totalRecord,
            data,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, responseData);
    } catch (error) {
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
        const take = 5; // custom page size là 5
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
                        Lecture: {
                            where: {
                                is_delete: false,
                            },
                            select: {
                                id: true,
                                type: true,
                                lesson: true,
                                test: true,
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
                test: true,
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

                const sections: Section[] = course.sections.map((section) => {
                    const lecture = section.Lecture.map((lecture) => {
                        let content;
                        if (lecture.type === "Lesson") content = lecture.lesson;
                        else content = lecture.test;
                        const tempLecture: Lecture = {
                            lecture_id: lecture.id,
                            type: lecture.type,
                            content,
                        };
                        return tempLecture;
                    });
                    const temp: Section = {
                        title: section.title,
                        updated_at: section.updated_at,
                        id: section.id,
                        lecture,
                    };
                    return temp;
                });
                let number_of_lecture = 0;
                let number_of_section = 0;
                sections.forEach((section, index) => {
                    number_of_section += 1;
                    number_of_lecture += section.lecture.length;
                });
                let test;
                if (course.test)
                    test = {
                        test_id: course.test.id,
                        title: course.test.title,
                        description: course.test.description,
                        is_time_limit: course.test.is_time_limit,
                        duration: course.test.duration,
                        pass_percent: course.test.pass_percent,
                        quiz_group_id: course.test.quiz_group_id,
                        number_of_question: course.test.number_of_question,
                    };
                else test = null;
                const courseData: CourseDetail = {
                    course_id: course.id,
                    title: course.title,
                    summary: course.summary,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    url_trailer: course.url_trailer,
                    average_rating: course.average_rating,
                    number_of_rating: course.number_of_rating,
                    number_of_enrolled: course.number_of_enrolled,
                    author: author,
                    number_of_section,
                    number_of_lecture,
                    categories: categories,
                    sections: sections,
                    status: course.status,
                    price: course.price,
                    sale_price: course.sale_price,
                    sale_until: course.sale_until,
                    slug: course.slug,
                    final_test_id: course.final_test_id,
                    test,
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
                        Lecture: {
                            where: {
                                is_delete: false,
                            },
                            select: {
                                id: true,
                                lesson: true,
                                test: true,
                                type: true,
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
                approval: {
                    where: {
                        is_handle: false,
                    },
                },
                test: true,
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
                const approval = course.approval.map((approval) => {
                    const temp = { ...approval, approval_id: approval.id };
                    return temp;
                });
                const author = { ...course.user, user_id: course.user.id };
                const sections: Section[] = course.sections.map((section) => {
                    const lecture = section.Lecture.map((lecture) => {
                        let content;
                        if (lecture.type === "Lesson") content = lecture.lesson;
                        else content = lecture.test;
                        const tempLecture: Lecture = {
                            lecture_id: lecture.id,
                            type: lecture.type,
                            content,
                        };
                        return tempLecture;
                    });
                    const temp: Section = {
                        title: section.title,
                        updated_at: section.updated_at,
                        id: section.id,
                        lecture,
                    };
                    return temp;
                });
                let test;
                if (course.test)
                    test = {
                        test_id: course.test.id,
                        title: course.test.title,
                        description: course.test.description,
                        is_time_limit: course.test.is_time_limit,
                        duration: course.test.duration,
                        pass_percent: course.test.pass_percent,
                        quiz_group_id: course.test.quiz_group_id,
                    };
                else test = null;
                const courseData: CourseDetail = {
                    course_id: course.id,
                    title: course.title,
                    summary: course.summary,
                    description: course.description,
                    thumbnail: course.thumbnail,
                    url_trailer: course.url_trailer,
                    average_rating: course.average_rating,
                    number_of_rating: course.number_of_rating,
                    number_of_enrolled: course.number_of_enrolled,
                    author: author,
                    approval,
                    categories: categories,
                    sections: sections,
                    status: course.status,
                    price: course.price,
                    sale_price: course.sale_price,
                    sale_until: course.sale_until,
                    slug: course.slug,
                    final_test_id: course.final_test_id,
                    test,
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

const getAllSalesCourses = async (req: Request): Promise<ResponseBase> => {
    try {
        const pageIndex: number | undefined = req.query.page_index
            ? parseInt(req.query.page_index as string, 10)
            : undefined;
        const take = configs.general.PAGE_SIZE;
        const skip = ((Number(pageIndex) ?? 1) - 1) * take;
        const courseCardData: any = await configs.db.$queryRaw<CourseCard[]>`
            SELECT 
                Course.id AS course_id,
                Course.title,
                Course.summary,
                Course.thumbnail,
                Course.number_of_rating,
                Course.average_rating,
                Course.number_of_enrolled,
                Course.created_at,
                Course.price,
                Course.sale_price,
                Course.sale_until,
                Course.status,
                JSON_OBJECT(
                    'user_id', User.id,
                    'first_name', User.first_name,
                    'last_name', User.last_name
                ) AS author,
                Course.slug,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', Category.id,
                        'title', Category.title,
                        'url_image', Category.url_image
                    )
                ) AS category
            FROM 
                Course
            JOIN 
                User ON Course.author_id = User.id
            LEFT JOIN 
                courses_categories ON courses_categories.course_id = Course.id
            LEFT JOIN 
                Category ON Category.id = courses_categories.category_id
            WHERE 
                Course.is_delete = false
                AND Course.status = true
                AND Course.sale_price IS NOT NULL
                AND Course.sale_price < Course.price
            GROUP BY 
                Course.id
            LIMIT ${skip}, ${take};
        `;
        // const totalRecordBigInt = totalRecord[0].total_record;
        // const totalRecordNumber = parseInt(totalRecordBigInt.toString());
        if (!courseCardData) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        } else console.log("This is:", courseCardData.length);
        const totalPage = Math.ceil(courseCardData.length / take);
        const responseData: PagingResponse<CourseCard[]> = {
            total_page: totalPage,
            total_record: courseCardData.length,
            data: courseCardData,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, responseData);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop10SalesCourses = async (req: Request): Promise<ResponseBase> => {
    try {
        const top10SalesCourses: any = await configs.db.$queryRaw`
        SELECT 
                Course.id AS course_id,
                Course.title,
                Course.summary,
                Course.thumbnail,
                Course.number_of_rating,
                Course.average_rating,
                Course.number_of_enrolled,
                User.id AS user_id,
                User.first_name,
                User.last_name,
                Course.slug,
                Course.study,
                Course.updated_at,
                Course.price,
                Course.sale_price,
                Course.sale_until,
                JSON_OBJECT(
                    'user_id', User.id,
                    'first_name', User.first_name,
                    'last_name', User.last_name
                ) AS author,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'category_id', Category.id,
                        'title', Category.title,
                        'url_image', Category.url_image
                    )
                ) AS categories
            FROM 
                Course
            JOIN 
                User ON Course.author_id = User.id
            LEFT JOIN 
                courses_categories ON courses_categories.course_id = Course.id
            LEFT JOIN 
                Category ON Category.id = courses_categories.category_id
            WHERE 
                Course.is_delete = false
                AND Course.status = true
                AND Course.price - Course.sale_price > 0
            GROUP BY 
                Course.id
            ORDER BY 
                Course.price - Course.sale_price  DESC
            LIMIT 10;
        `;
        if (top10SalesCourses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        } else console.log("Here:", top10SalesCourses.length);

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, top10SalesCourses);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const approveCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                is_admin: true,
                id: user_id,
            },
        });
        if (!isAdmin) return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                is_delete: false,
                status: false,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        const approveCourse = await configs.db.course.update({
            where: {
                id: isFoundCourse.id,
            },
            data: {
                status: true,
            },
        });

        if (!approveCourse) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        const clearApproval = await configs.db.approval.updateMany({
            where: {
                course_id: isFoundCourse.id,
                is_handle: false,
            },
            data: {
                is_handle: true,
            },
        });
        return new ResponseSuccess(200, constants.success.SUCCESS_APPROVE_COURSE, true);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const restrictCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                is_admin: true,
                id: user_id,
            },
        });
        if (!isAdmin) return new ResponseError(401, constants.error.ERROR_UNAUTHORIZED, false);
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                id: Number(course_id),
                is_delete: false,
                status: true,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        const restrictCourse = await configs.db.course.update({
            where: {
                id: isFoundCourse.id,
            },
            data: {
                status: false,
            },
        });

        if (!restrictCourse) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_RESTRICT_COURSE, true);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getProgressByCourseSlug = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { slug } = req.params;
        const userId = Number(req.user_id);
        const isFoundCourse = await configs.db.course.findFirst({
            where: {
                slug,
            },
        });
        if (!isFoundCourse) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const getProgress = await configs.db.progress.findMany({
            where: {
                course_id: Number(isFoundCourse.id),
                user_id: userId,
                is_delete: false,
            },
            orderBy: {
                lecture_id: "asc",
            },
            include: {
                lecture: {
                    select: {
                        section_id: true,
                        lesson: true,
                        test: true,
                        type: true,
                    },
                },
            },
        });

        const getOverall = await configs.db.progress.count({
            where: {
                course_id: Number(isFoundCourse.id),
                user_id: userId,
                pass: true,
                is_delete: false,
            },
        });
        if (!getProgress) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const progressData = getProgress.map((progress) => {
            const duration =
                progress.lecture.type === "Lesson"
                    ? progress.lecture.lesson?.duration
                    : progress.lecture.test?.duration;
            const temp = {
                progress_id: progress.id,
                lecture_id: progress.lecture_id,
                section_id: progress.lecture.section_id,
                is_pass: progress.pass,
                duration,
                progress_value: progress.progress_value,
                progress_percent: progress.progress_percent,
            };
            return temp;
        });
        const data = {
            overall_progress: getOverall,
            progress: progressData,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCourseDetailForTrialLesson = async (req: IRequestWithId): Promise<ResponseBase> => {
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
                        Lecture: {
                            where: {
                                is_delete: false,
                                type: "lesson",
                            },
                            select: {
                                id: true,
                                type: true,
                                lesson: true,
                                // test: true,
                            },
                            orderBy: {
                                created_at: "asc",
                            },
                            take: 1,
                        },
                    },
                    where: {
                        is_delete: false,
                    },
                    take: 2,
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

                const sections: Section[] = course.sections.map((section) => {
                    const lecture = section.Lecture.map((lecture) => {
                        let content;
                        if (lecture.type === "Lesson") content = lecture.lesson;
                        // else content = lecture.test;
                        const tempLecture: Lecture = {
                            lecture_id: lecture.id,
                            type: lecture.type,
                            content,
                        };
                        return tempLecture;
                    });
                    const temp: Section = {
                        title: section.title,
                        updated_at: section.updated_at,
                        id: section.id,
                        lecture,
                    };
                    return temp;
                });
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
                    url_trailer: course.url_trailer,
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
                    final_test_id: course.final_test_id,
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
const getAllEnrolled = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const user_id = Number(req.user_id);
        const getAllEnrolled = await configs.db.enrolled.findMany({
            where: {
                user_id,
            },
        });
        if (!getAllEnrolled) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, getAllEnrolled);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getCertificate = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseId = Number(req.params.course_id);

        const isEnrolleDone = await configs.db.enrolled.findFirst({
            where: {
                user_id: userId,
                course_id: courseId,
                is_done: true,
            },
        });
        if (!isEnrolleDone) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const getCertificate = await configs.db.certificate.findFirst({
            where: {
                recipient_id: userId,
                course_id: courseId,
            },
        });
        if (!getCertificate) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, {
            public_id: getCertificate.public_id,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const createFinalTest = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const content = req.body;
        const courseId = Number(content.course_id);
        const title = content.title;
        const duration = Number(content.duration) * 60;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "true" ? true : false;
        const quizList = await configs.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const isCourseExist = await configs.db.course.findFirst({
            where: {
                id: courseId,
            },
        });
        if (!isCourseExist) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const createTest = await configs.db.test.create({
            data: {
                title,
                duration: duration.toString(),
                description,
                pass_percent,
                quiz_group_id,
                number_of_question: quizList.length,
                is_time_limit,
            },
        });
        const updateCourse = await configs.db.course.update({
            where: {
                id: courseId,
            },
            data: {
                final_test_id: createTest.id,
            },
        });
        const createTestDetailData = quizList.map((quiz) => {
            const temp = {
                test_id: createTest.id,
                quiz_id: quiz.id,
            };
            return temp;
        });
        const createTestDetail = await configs.db.testDetail.createMany({
            data: createTestDetailData,
        });
        if (!createTestDetail) {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        } else {
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const updateFinalTest = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const content = req.body;
        const courseId = Number(req.params.course_id);
        const title = content.title;
        const duration = Number(content.duration) * 60;
        const description = content.description;
        const pass_percent = Number((Number(content.pass_percent) / 100).toFixed(2));
        const quiz_group_id = Number(content.quiz_group_id);
        const is_time_limit = content.is_time_limit === "true" ? true : false;
        const quizList = await configs.db.quiz.findMany({
            where: {
                quiz_group_id,
                is_delete: false,
            },
        });
        const isExistCourse = await configs.db.course.findUnique({
            where: {
                id: courseId,
            },
        });
        if (!isExistCourse || !isExistCourse.final_test_id)
            return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isExistTest = await configs.db.test.findFirst({
            where: {
                id: isExistCourse.final_test_id,
                is_delete: false,
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const updateTest = await configs.db.test.update({
            data: {
                title,
                duration: duration.toString(),
                description,
                pass_percent,
                quiz_group_id,
                number_of_question: quizList.length,
                is_time_limit,
            },
            where: {
                id: isExistTest.id,
            },
        });
        if (!updateTest) return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        if (quiz_group_id !== isExistTest?.quiz_group_id) {
            const createTestDetailData = quizList.map((quiz) => {
                const temp = {
                    test_id: updateTest.id,
                    quiz_id: quiz.id,
                };
                return temp;
            });
            const clearOldTestDetail = await configs.db.testDetail.deleteMany({
                where: {
                    test_id: isExistTest.id,
                },
            });
            const createTestDetail = await configs.db.testDetail.createMany({
                data: createTestDetailData,
            });
            if (!createTestDetail) {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            } else {
                return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
            }
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const deleteFinalTest = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const courseId = Number(req.params.course_id);
        const isExistCourse = await configs.db.course.findFirst({
            where: {
                id: courseId,
                is_delete: false,
            },
        });
        if (!isExistCourse) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        if (!isExistCourse.final_test_id) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isExistTest = await configs.db.test.findFirst({
            where: {
                id: isExistCourse.final_test_id,
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const deleteTest = await configs.db.test.update({
            where: {
                id: isExistTest.id,
            },
            data: {
                is_delete: true,
            },
        });

        if (deleteTest) {
            const updateCourse = await configs.db.course.update({
                where: {
                    id: isExistCourse.id,
                },
                data: {
                    final_test_id: null,
                },
            });
            const deleteTestDetail = await configs.db.testDetail.deleteMany({
                where: {
                    test_id: deleteTest.id,
                },
            });
            return new ResponseSuccess(200, constants.success.SUCCESS_DELETE_DATA, true);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const getFinalTestByCourseId = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const courseId = Number(req.params.course_id);
        const isExistCourse = await configs.db.course.findFirst({
            where: {
                id: courseId,
                is_delete: false,
            },
        });
        if (!isExistCourse) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        if (!isExistCourse.final_test_id) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const isExistTest = await configs.db.test.findFirst({
            where: {
                id: isExistCourse.final_test_id,
            },
        });
        if (!isExistTest) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const data = {
            test_id: isExistTest.id,
            title: isExistTest.title,
            description: isExistTest.description,
            is_time_limit: isExistTest.is_time_limit,
            duration: isExistTest.duration,
            pass_percent: isExistTest.pass_percent,
            quiz_group_id: isExistTest.quiz_group_id,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
    }
};
const setDoneCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const courseId = Number(req.params.course_id);
        const userId = Number(req.user_id);
        const isExistEnrolled = await configs.db.enrolled.findFirst({
            where: {
                course_id: courseId,
                user_id: userId,
                is_done: false,
            },
        });
        if (!isExistEnrolled) return new ResponseError(500, constants.error.ERROR_DATA_NOT_FOUND, false);
        const setDoneCourse = await configs.db.enrolled.update({
            where: {
                id: isExistEnrolled.id,
            },
            data: {
                is_done: true,
            },
        });

        if (setDoneCourse) {
            return new ResponseSuccess(200, constants.success.SUCCESS_UPDATE_DATA, true);
        } else {
            return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
        }
    } catch (error) {
        return new ResponseError(500, JSON.stringify(error), false);
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
    getAllSalesCourses,
    getTop10SalesCourses,
    updateTargetCourse,
    approveCourse,
    restrictCourse,
    getProgressByCourseSlug,
    getCourseDetailForTrialLesson,
    getAllEnrolled,
    getCertificate,
    createFinalTest,
    updateFinalTest,
    deleteFinalTest,
    setDoneCourse,
    getFinalTestByCourseId,
};

export default CourseServices;
