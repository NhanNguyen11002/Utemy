import * as Yup from "yup";
import constants from "../constants";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const SUPPORTED_VIDEO_FORMATS = ["video/mp4", "video/mov", "video/x-matroska"];
export const createCourseValidationSchema = Yup.object({
    thumbnail: Yup.mixed()
        .nullable()
        .required(constants.error.ERROR_COURSE_THUMBNAIL_REQUIRED)
        .test("fileFormat", constants.error.ERROR_IMAGE_NOT_SUPPORTED, (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", constants.error.ERROR_IMAGE_TOO_BIG, (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    trailer: Yup.mixed()
        .nullable()
        .required(constants.error.ERROR_COURSE_TRAILER_REQUIRED)
        .test("fileFormat", constants.error.ERROR_VIDEO_NOT_SUPPORTED, (value: any) => {
            return value && SUPPORTED_VIDEO_FORMATS.includes(value.type);
        })
        .test("fileSize", constants.error.ERROR_VIDEO_TOO_BIG, (value: any) => {
            return value && value.size <= 1024 * 1024 * 100; // 100 MB
        }),

    categories: Yup.array().min(1, constants.error.ERROR_CATEGORY_REQUIRED).max(4, constants.error.ERROR_CATEGORY_MAX),
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    summary: Yup.string()
        .trim()
        .required(constants.error.ERROR_COURSE_SUMMARY_REQUIRED)
        .max(200, constants.error.ERROR_COURSE_SUMMARY_MAX),
    description: Yup.string()
        .trim()
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED)
        .max(400, constants.error.ERROR_DESCRIPTION_TOO_MAX),
    price: Yup.number().positive().required(constants.error.ERROR_COURSE_PRICE_REQUIRED),
});

export const editCourseValidationSchema = Yup.object({
    // thumbnail: Yup.mixed()
    //     .nullable()
    //     .test("fileFormat", constants.error.ERROR_IMAGE_NOT_SUPPORTED, (value: any) => {
    //         console.log("type", value.type);
    //         return value && SUPPORTED_FORMATS.includes(value.type);
    //     })
    //     .test("fileSize", constants.error.ERROR_IMAGE_TOO_BIG, (value: any) => {
    //         console.log("size", value.size);
    //         return value && value.size <= 1024 * 1024 * 4;
    //     }),
    categories: Yup.array().min(1, constants.error.ERROR_CATEGORY_REQUIRED).max(4, constants.error.ERROR_CATEGORY_MAX),
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    summary: Yup.string()
        .trim()
        .required(constants.error.ERROR_COURSE_SUMMARY_REQUIRED)
        .max(200, constants.error.ERROR_COURSE_SUMMARY_MAX),
    description: Yup.string()
        .trim()
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED)
        .max(400, constants.error.ERROR_DESCRIPTION_TOO_MAX),
    price: Yup.number().positive().required(constants.error.ERROR_COURSE_PRICE_REQUIRED),
});
export const addPromotionValidationSchema = Yup.object({
    sale_price: Yup.number().positive().required(constants.error.ERROR_SALE_PRICE_REQUIRED),
    sale_until: Yup.date()
        .min(new Date(), constants.error.ERROR_SALE_UNTIL_MIN)
        .required(constants.error.ERROR_SALE_UNTIL_REQUIRED),
});
