import * as Yup from "yup";
import constants from "../constants";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const createBlogValidationSchema = Yup.object({
    image_blog: Yup.mixed()
        .nullable()
        .required(constants.error.ERROR_COURSE_THUMBNAIL_REQUIRED)
        .test("fileFormat", constants.error.ERROR_IMAGE_NOT_SUPPORTED, (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", constants.error.ERROR_IMAGE_TOO_BIG, (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),

    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
});
export const editBlogValidationSchema = Yup.object({
    // image_blog: Yup.mixed()
    //     .nullable()
    //     .required(constants.error.ERROR_COURSE_THUMBNAIL_REQUIRED)
    //     .test("fileFormat", constants.error.ERROR_IMAGE_NOT_SUPPORTED, (value: any) => {
    //         return value && SUPPORTED_FORMATS.includes(value.type);
    //     })
    //     .test("fileSize", constants.error.ERROR_IMAGE_TOO_BIG, (value: any) => {
    //         return value && value.size <= 1024 * 1024 * 4;
    //     }),
    categories: Yup.array().min(1, constants.error.ERROR_CATEGORY_REQUIRED).max(4, constants.error.ERROR_CATEGORY_MAX),
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    cotent: Yup.string().trim(),
});
