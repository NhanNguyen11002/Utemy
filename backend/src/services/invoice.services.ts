import { IRequestWithId } from "../types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { PagingArrayResponse, PagingResponse } from "../types/response";
import { InvoiceInfo } from "../types/invoice";
import { Console } from "console";

const createInvoice = async (
    req: IRequestWithId,
    totalwithcoupon: number,
    discount: number,
    coupon_id: number | null,
): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const isInvoiceNotSucess = await configs.db.invoice.findFirst({
            where: {
                user_id: userId,
                is_success: false,
            },
        });
        if (isInvoiceNotSucess)
            await configs.db.invoice.delete({
                where: {
                    id: isInvoiceNotSucess.id,
                },
            });
        const createInvoice = await configs.db.invoice.create({
            data: {
                user_id: userId,
                total_money: totalwithcoupon,
            },
        });
        let cartId = 0;
        const isCartExist = await configs.db.cart.findFirst({
            where: {
                user_id: userId,
            },
        });

        if (isCartExist) {
            cartId = isCartExist.id;
        } else {
            const createCart = await configs.db.cart.create({
                data: {
                    user_id: userId,
                },
            });
            return new ResponseError(404, "You don't have any courses in cart", false);
        }
        const boughtCourses = await configs.db.cartDetail.findMany({
            where: {
                cart_id: cartId,
                saved_for_later: false,
            },
            include: {
                course: true,
            },
        });
        if (boughtCourses.length === 0) {
            return new ResponseError(404, "You don't have any courses in cart", false);
        }
        let total_money = 0;
        const createInvoiceDetailData = boughtCourses.map((cartDetail) => {
            const now = new Date();
            let paidPrice;
            if (cartDetail.course.sale_until && cartDetail.course.sale_until > now && cartDetail.course.sale_price) {
                paidPrice = cartDetail.course.sale_price - cartDetail.course.sale_price * discount;
            } else paidPrice = cartDetail.course.price - cartDetail.course.price * discount;
            total_money += Number(paidPrice);
            const data = {
                invoice_id: createInvoice.id,
                course_id: cartDetail.course_id,
                retail_price: Number(cartDetail.course.price),
                paid_price: Number(paidPrice),
            };
            return data;
        });
        const updateInvoice = await configs.db.invoice.update({
            where: {
                id: createInvoice.id,
            },
            data: {
                total_money,
                coupon_id: coupon_id,
            },
        });
        const createInvoiceDetail = await configs.db.invoiceDetail.createMany({
            data: createInvoiceDetailData,
        });
        if (createInvoiceDetail && updateInvoice)
        {
            console.log("couponid:", coupon_id);
            return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true);
        }
        else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getAllInvoices = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { page_index: pageIndex, page_size: pageSize } = req.query;

        // Parse pageIndex and pageSize to numbers, set default values if not provided
        const parsePageIndex = Number(pageIndex) || 1;
        const parsePageSize = Number(pageSize) || 10;

        // Calculate skip based on pageIndex and pageSize
        const skip = (parsePageIndex - 1) * parsePageSize;

        // Retrieve paginated invoices with details and courses
        const getInvoices = await configs.db.invoice.findMany({
            where: {
                user_id: userId,
                is_success: true,
            },
            include: {
                invoice_detail: {
                    include: {
                        course: true,
                    },
                },
            },
            skip,
            take: parsePageSize,
        });

        // Calculate total records for pagination info
        const totalRecord = await configs.db.invoice.count({
            where: {
                user_id: userId,
                is_success: true,
            },
        });

        // Calculate total pages
        const totalPage = Math.ceil(totalRecord / parsePageSize);

        // Prepare paginated response
        const paginatedResponse: PagingArrayResponse<InvoiceInfo> = {
            total_page: totalPage,
            total_record: totalRecord,
            data: getInvoices.map((invoice) => ({
                id: invoice.id,
                user_id: invoice.user_id,
                total_money: invoice.total_money,
                is_success: invoice.is_success,
                created_at: invoice.created_at,
                invoice_detail: invoice.invoice_detail.map((detail) => ({
                    id: detail.id,
                    invoice_id: detail.invoice_id,
                    course_id: detail.course_id,
                    retail_price: detail.retail_price,
                    paid_price: detail.paid_price,
                    course: {
                        course_id: detail.course.id,
                        title: detail.course.title,
                        slug: detail.course.slug,
                        status: detail.course.status,
                        description: detail.course.description,
                        thumbnail: detail.course.thumbnail,
                        summary: detail.course.summary,
                        is_delete: detail.course.is_delete,
                        created_at: detail.course.created_at,
                        updated_at: detail.course.updated_at,
                        average_rating: detail.course.average_rating,
                        number_of_rating: detail.course.number_of_rating,
                        number_of_enrolled: detail.course.number_of_enrolled,
                        author_id: detail.course.author_id,
                        price: detail.course.price,
                        sale_price: detail.course.sale_price,
                        sale_until: detail.course.sale_until,
                        // Other course information...
                    },
                })),
            })),
        };

        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, paginatedResponse);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getNowInvoice = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const getInvoice = await configs.db.invoice.findFirst({
            where: {
                user_id: userId,
                is_success: false,
            },
            include: {
                invoice_detail: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (getInvoice) {
            const invoice_items = getInvoice.invoice_detail.map((detail) => {
                const course = {
                    course_id: detail.course.id,
                    title: detail.course.title,
                    thumbnail: detail.course.thumbnail,
                };
                const temp = {
                    invoice_detail_id: detail.id,
                    retail_price: detail.retail_price,
                    paid_price: detail.paid_price,
                    course,
                };
                return temp;
            });
            const data = {
                invoice_id: getInvoice.id,
                user_id: getInvoice.user_id,
                total_money: getInvoice.total_money,
                created_at: getInvoice.created_at,
                invoice_items,
            };
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
        } else return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const getInvoiceById = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const userId = Number(req.user_id);
        const { invoice_id: invoiceId } = req.params;

        // Validate if invoiceId is provided
        if (!invoiceId) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }

        // Retrieve the invoice with details and courses
        const invoice = await configs.db.invoice.findFirst({
            where: {
                id: Number(invoiceId),
                user_id: userId,
                is_success: true,
            },
            include: {
                invoice_detail: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        // Check if the invoice is not found
        if (!invoice) {
            return new ResponseError(404, constants.error.ERROR_INVOICE_NOT_FOUND, false);
        } else return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, invoice);
    } catch (error) {
        console.log(error); // In ra lỗi để kiểm tra
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const invoiceService = { getAllInvoices, createInvoice, getNowInvoice, getInvoiceById };
export default invoiceService;
