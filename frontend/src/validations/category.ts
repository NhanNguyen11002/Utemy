import * as Yup from "yup";
import constants from "../constants";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const createCategoryValidationSchema = Yup.object({
    categoryImage: Yup.mixed()
        .nullable()
        .required(constants.error.ERROR_CATEGORY_IMAGE_REQUIRED)
        .test("fileFormat", constants.error.ERROR_IMAGE_NOT_SUPPORTED, (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", constants.error.ERROR_IMAGE_TOO_BIG, (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    description: Yup.string()
        .trim()
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED)
        .max(400, constants.error.ERROR_DESCRIPTION_TOO_MAX),
});
export const editCategoryValidationSchema = Yup.object({
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    description: Yup.string()
        .trim()
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED)
        .max(400, constants.error.ERROR_DESCRIPTION_TOO_MAX),
});
