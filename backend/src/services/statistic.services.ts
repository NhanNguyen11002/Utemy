import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { Enrolled, Prisma } from "@prisma/client";
import { ParsedQs } from "qs";
import { getISOWeek } from "date-fns";

const courseCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const courseCount = await configs.db.course.count({
            where: {
                is_delete: false,
            },
        });
        const data = {
            course_count: courseCount,
        };
        if (courseCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyCalculation = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const moneyCalculation = await configs.db.invoice.aggregate({
            _sum: {
                total_money: true,
            },
        });
        const data = {
            total_money: moneyCalculation._sum.total_money,
        };
        if (moneyCalculation) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const userCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const userCount = await configs.db.user.count({
            where: {
                is_deleted: false,
            },
        });
        const data = {
            total_user: userCount,
        };
        if (userCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const invoiceCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const invoiceCount = await configs.db.transaction.count();
        const data = {
            total_invoice: invoiceCount,
        };
        if (invoiceCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryCourseCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const categoryCourseCount = await configs.db.courseCategory.groupBy({
            by: ["category_id"],
            _count: {
                course_id: true,
            },
        });
        const categories = await configs.db.category.findMany();
        const categoryHashTable: Record<number | string, string> = categories.reduce((acc: any, category) => {
            acc[category.id] = category.title;
            return acc;
        }, {});
        const convertData = categoryCourseCount.map((categoryCourse) => {
            const temp = {
                id: categoryCourse.category_id,
                title: categoryHashTable[categoryCourse.category_id],
                course_count: categoryCourse._count.course_id,
            };
            return temp;
        });
        if (categoryCourseCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, convertData);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryEnrolledCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const categoryCourseCount = await configs.db
            .$queryRaw`select sum(number_of_enrolled) as total_enrolled, category_id, title from (select number_of_enrolled, category_id, category.title as title from course left join courses_categories on courses_categories.course_id = course.id 
                left join category on courses_categories.category_id = category.id where number_of_enrolled != 0 ) as temp_table group by category_id;`;

        if (categoryCourseCount)
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoryCourseCount);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const categoryMoneyCount = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const categoryMoneyCount = await configs.db
            .$queryRaw`select  category.id as category_id, category.title as category_title, sum(invoice_detail.paid_price) as total_money_from_category from courses_categories left join course 
            on courses_categories.course_id = course. id right join invoice_detail on invoice_detail.course_id = course.id left join category 
            on courses_categories.category_id = category.id group by category_title;`;

        if (categoryMoneyCount)
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, categoryMoneyCount);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingPercent = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const ratingCount: any = await configs.db
            .$queryRaw`select count(course.id) as number_of_courses, round(average_rating) as rounded_rating from course group by round(average_rating) order by rounded_rating limit 5 offset 1`;
        const courseHasRatingCount = await configs.db.course.count({
            where: {
                NOT: {
                    average_rating: 0,
                },
            },
        });
        const data: any = ratingCount.map((rating: any) => {
            const temp = {
                title: rating.rounded_rating,
                percent: Number(
                    (Number(Number(rating.number_of_courses) / Number(courseHasRatingCount)) * 100).toFixed(2),
                ),
            };
            return temp;
        });
        if (ratingCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyByMonth = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { year } = req.params;
        const userId = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: userId,
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, constants.error.ERROR_UNAUTHORIZED, false);
        const moneyByMonthQuery: any = await configs.db
            .$queryRaw`select sum(total_money) as total_money_month, month(created_at) as month_label from invoice where is_success = 1 and year(created_at) = ${year} group by month(created_at);`;
        const monthThatHasMoney: Record<number | string, string> = moneyByMonthQuery.reduce((acc: any, month: any) => {
            acc[month.month_label] = month.total_money_month;
            return acc;
        }, {});
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const data = months.map((month) => {
            return {
                month_label: month,
                total_money_month: monthThatHasMoney[month] || 0,
            };
        });

        if (moneyByMonthQuery) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const courseCountByOwnerCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseCountByOwnerCourse = await configs.db.course.count({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const approvals = await configs.db.approval.findMany({
            where: {
                is_handle: true,
            },
            include: {
                course: true,
            },
        });

        const coursesApprove = approvals.filter(
            (approval) => approval.course && !approval.course.is_delete && approval.course.author_id === userId,
        );

        const notApprovals = await configs.db.approval.findMany({
            where: {
                is_handle: false,
            },
            include: {
                course: true,
            },
        });

        const coursesNotApprove = notApprovals.filter(
            (notApproval) =>
                notApproval.course && !notApproval.course.is_delete && notApproval.course.author_id === userId,
        );

        const countCoursesApprove = coursesApprove.length;
        const data = {
            course_count: courseCountByOwnerCourse,
            course_approve_count: countCoursesApprove,
            course_not_approve_count: coursesNotApprove.length,
        };
        if (courseCountByOwnerCourse) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop5EnrolledCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const top5Courses = await configs.db.course.findMany({
            take: 5,
            where: {
                is_delete: false,
                status: true,
                author_id: userId,
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
        const formattedData = top5Courses.map((course) => {
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
        // Đảm bảo top5Courses có dữ liệu
        if (top5Courses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 5 khóa học
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getTop5RateCourse = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const top5Courses = await configs.db.course.findMany({
            take: 5,
            where: {
                is_delete: false,
                status: true,
                author_id: userId,
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
        const formattedData = top5Courses.map((course) => {
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
        if (top5Courses.length === 0) {
            return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
        }
        // Trả về danh sách top 5 khóa học
        return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, formattedData);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyCalculationByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const invoiceDetailsForOwnerCourse = await configs.db.invoiceDetail.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
        });
        const data = {
            total_money: invoiceDetailsForOwnerCourse.reduce((total, detail) => {
                return total + detail.paid_price;
            }, 0),
        };
        if (invoiceDetailsForOwnerCourse)
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneySaleCourseCalculationByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        // const courseSaleUntils = courseByOwnerCourse.map((course) => course.sale_until);
        const invoiceDetailsForOwnerCourse = await configs.db.invoiceDetail.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
            include: {
                invoice: true,
                course: true,
            },
        });
        const result = invoiceDetailsForOwnerCourse.filter(
            (r) =>
                (r.invoice.coupon_id == null && r.paid_price < r.retail_price) ||
                (r.course.sale_until && r.invoice.coupon_id !== null && r.invoice.created_at < r.course.sale_until),
        );
        const data = {
            total_money: result.reduce((total, detail) => {
                return total + detail.paid_price;
            }, 0),
        };
        if (result.length == 0) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        if (result.length > 0) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyOriginCourseByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        // Tính tổng tiền từ hàm moneyCalculationByOwner
        const moneyCalculationResult = await moneyCalculationByOwner(req);
        if (!moneyCalculationResult) {
            return moneyCalculationResult; // Trả về lỗi nếu hàm này gặp lỗi
        }

        // Tính tổng tiền giảm giá từ hàm moneySaleCourseCalculationByOwner
        const moneySaleCalculationResult = await moneySaleCourseCalculationByOwner(req);
        if (!moneySaleCalculationResult) {
            return moneySaleCalculationResult; // Trả về lỗi nếu hàm này gặp lỗi
        }

        // Tính toán số tiền thực tế
        const totalMoney = moneyCalculationResult.data.total_money;
        const totalSaleMoney = moneySaleCalculationResult.data.total_money;
        const netMoney = totalMoney - totalSaleMoney;

        const data = {
            total_money: netMoney,
        };

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const totalPassOrUnpassCourseOfOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const enrolledCourseStudent = await configs.db.enrolled.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
        });
        const passCourseStudent = await configs.db.enrolled.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
                is_pass: true,
            },
        });
        const unpassCourseStudent = await configs.db.enrolled.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
                is_pass: false,
            },
        });
        const data = {
            total_enrolled: enrolledCourseStudent.length,
            total_pass: passCourseStudent.length,
            total_unpass: unpassCourseStudent.length,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyByMonthByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { year } = req.params;
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const moneyByMonthQuery: any = await configs.db.$queryRaw`
        SELECT 
            SUM(id.paid_price) AS total_money_month, 
            MONTH(i.created_at) AS month_label,
            YEAR(i.created_at) AS year_label
        FROM 
            invoice_detail id
        JOIN 
            invoice i ON id.invoice_id = i.id
        WHERE 
            YEAR(i.created_at) = ${year} AND
            id.course_id IN (${Prisma.join(courseIds)})
        GROUP BY 
            YEAR(i.created_at), MONTH(i.created_at);
    `;
        const monthThatHasMoney: Record<number | string, string> = moneyByMonthQuery.reduce((acc: any, month: any) => {
            acc[month.month_label] = month.total_money_month;
            return acc;
        }, {});
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const data = months.map((month) => {
            return {
                month_label: month,
                total_money_month: monthThatHasMoney[month] || 0,
            };
        });

        if (moneyByMonthQuery) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.log(error);
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const moneyByCourseByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const invoiceDetailsForOwnerCourse = await configs.db.invoiceDetail.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
        });
        if (invoiceDetailsForOwnerCourse) {
            const revenueByCourse: { [key: number]: number } = invoiceDetailsForOwnerCourse.reduce(
                (acc: { [key: number]: number }, detail) => {
                    if (!acc[detail.course_id]) {
                        acc[detail.course_id] = 0;
                    }
                    acc[detail.course_id] += detail.paid_price;
                    return acc;
                },
                {},
            );

            const result = courseByOwnerCourse.map((course) => ({
                course_id: course.id,
                course_title: course.title, // assuming 'title' is a field in your course model
                course_slug: course.slug,
                number_of_enrolled: course.number_of_enrolled,
                total_revenue: revenueByCourse[course.id] || 0,
            }));

            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, result);
        } else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const userEnrolledCountByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const enrolledForOwnerCourse = await configs.db.enrolled.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
        });

        const uniqueUserIds = new Set(enrolledForOwnerCourse.map((enrollment) => enrollment.user_id));
        const totalUniqueStudents = uniqueUserIds.size;
        const data = {
            enrolled_count: totalUniqueStudents,
        };
        if (totalUniqueStudents) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const studentsRegisteredByTime = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { period, startDate, endDate } = req.query;
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);

        let periodField: keyof Enrolled;
        let dateFormat: string;

        const parseDate = (date: string | string[] | ParsedQs | ParsedQs[] | undefined): Date | undefined => {
            if (typeof date === "string") {
                return new Date(date);
            } else if (Array.isArray(date) && typeof date[0] === "string") {
                return new Date(date[0]);
            }
            return undefined;
        };

        const parsedStartDate = parseDate(startDate);
        const parsedEndDate = parseDate(endDate);

        switch (period) {
            case "day":
                periodField = "created_at";
                dateFormat = "%Y-%m-%d";
                break;
            case "week":
                periodField = "created_at";
                dateFormat = "%Y-%u";
                break;
            case "month":
                periodField = "created_at";
                dateFormat = "%Y-%m";
                break;
            case "year":
                periodField = "created_at";
                dateFormat = "%Y";
                break;
            default:
                return new ResponseError(400, "Invalid period", false);
        }

        const enrollmentsData = await configs.db.enrolled.groupBy({
            by: [periodField],
            where: {
                AND: [
                    { [periodField]: { gte: parsedStartDate } },
                    { [periodField]: { lte: parsedEndDate } },
                    { course_id: { in: courseIds } },
                ],
            },
            _count: true,
        });

        const formattedEnrollmentsData = enrollmentsData.map((record: any) => ({
            total_enrollments: record._count,
            period_label: formatDateLabel(period, new Date(record[periodField])),
        }));
        const totalEnrollments = formattedEnrollmentsData.reduce((acc, cur) => acc + cur.total_enrollments, 0);
        const periodLabels = formattedEnrollmentsData.map((record) => record.period_label).join(", ");
        const data = {
            total_enrollments: totalEnrollments,
            period_label: periodLabels,
        };
        return new ResponseSuccess(200, "Enrollments data retrieved successfully", true, data);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const formatDateLabel = (period: string, date: Date): string => {
    switch (period) {
        case "day":
            return date.toISOString().slice(0, 10); // Lấy ngày tháng (YYYY-MM-DD)
        case "week":
            // Logic để lấy tuần trong năm, ví dụ: "2024-W23"
            return `${date.getFullYear()}-W${getISOWeek(date)}`;
        case "month":
            return date.toISOString().slice(0, 7); // Lấy năm và tháng (YYYY-MM)
        case "year":
            return String(date.getFullYear()); // Chỉ lấy năm (YYYY)
        default:
            throw new Error("Invalid period");
    }
};

const studentsRegisteredByYear = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { year } = req.params;
        const userId = Number(req.user_id);
        const yearNumber = Number(year);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);

        const enrollmentsData = await configs.db.enrolled.findMany({
            where: {
                created_at: {
                    gte: new Date(yearNumber, 0, 1),
                    lt: new Date(yearNumber + 1, 0, 1),
                },
                course_id: {
                    in: courseIds,
                },
            },
            select: {
                created_at: true,
            },
        });

        const enrollmentsByMonth = Array.from({ length: 12 }, (_, i) => ({
            month_label: i + 1,
            total_enroll_month: 0,
        }));

        enrollmentsData.forEach((enrollment) => {
            const month = enrollment.created_at.getMonth();
            enrollmentsByMonth[month].total_enroll_month++;
        });

        return new ResponseSuccess(200, "Data fetched successfully", true, enrollmentsByMonth);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, "Failed to fetch data", false);
    }
};
const avgRateAllCoursesByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
                average_rating: {
                    not: 0,
                },
            },
        });
        if (courseByOwnerCourse.length === 0) {
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { average_rating: 0 });
        }
        const totalRating = courseByOwnerCourse.reduce((sum, course) => sum + course.average_rating, 0);
        const averageRating = totalRating / courseByOwnerCourse.length;
        const roundedAverageRating = Math.round(averageRating * 10) / 10;
        const data = {
            average_rating: roundedAverageRating,
        }
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const ratingPercentByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const ratingCount: any = await configs.db
            .$queryRaw`select count(course.id) as number_of_courses, round(average_rating) as rounded_rating from course where author_id = ${userId} group by round(average_rating) order by rounded_rating limit 5 offset 1`;
        const courseHasRatingCount = await configs.db.course.count({
            where: {
                is_delete: false,
                author_id: userId,
                NOT: {
                    average_rating: 0,
                },
            },
        });
        const data: any = ratingCount.map((rating: any) => {
            const temp = {
                title: rating.rounded_rating,
                percent: Number(
                    (Number(Number(rating.number_of_courses) / Number(courseHasRatingCount)) * 100).toFixed(2),
                ),
            };
            return temp;
        });
        if (ratingCount) return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const totalTurnRatingByOwner = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const courseByOwnerCourse = await configs.db.course.findMany({
            where: {
                is_delete: false,
                author_id: userId,
            },
        });
        const courseIds = courseByOwnerCourse.map((course) => course.id);
        const countTurnRatingCourse = await configs.db.rating.findMany({
            where: {
                course_id: {
                    in: courseIds,
                },
            },
        });
        const data = {
            total_turn_rating: countTurnRatingCourse.length,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const statisticServices = {
    categoryCourseCount,
    courseCount,
    categoryEnrolledCount,
    categoryMoneyCount,
    moneyCalculation,
    userCount,
    ratingPercent,
    moneyByMonth,
    invoiceCount,
    courseCountByOwnerCourse,
    getTop5EnrolledCourse,
    getTop5RateCourse,
    moneyCalculationByOwner,
    moneyByMonthByOwner,
    moneyByCourseByOwner,
    userEnrolledCountByOwner,
    studentsRegisteredByTime,
    studentsRegisteredByYear,
    moneySaleCourseCalculationByOwner,
    moneyOriginCourseByOwner,
    totalPassOrUnpassCourseOfOwner,
    avgRateAllCoursesByOwner,
    ratingPercentByOwner,
    totalTurnRatingByOwner,
};
export default statisticServices;
