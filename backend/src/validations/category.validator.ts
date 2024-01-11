import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type updateCategory = {
    category_id: number;
    title: string;
    description: string;
};
export const updateCategorySchema: ObjectSchema<updateCategory> = Joi.object({
    category_id: Joi.number().required().messages({
        "number.base": constants.error.ERROR_CATEGORY_ID_NUMBER,
        "any.required": constants.error.ERROR_CATEGORY_ID_REQUIRED,
    }),
    title: Joi.string().trim().required().max(50).messages({
        "string.base": constants.error.ERROR_TITLE_STRING,
        "any.required": constants.error.ERROR_TITLE_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_MAX,
    }),
    description: Joi.string().trim().required().max(200).min(8).messages({
        "string.base": constants.error.ERROR_DESCRIPTION_STRING,
        "any.required": constants.error.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants.error.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants.error.ERROR_DESCRIPTION_TOO_SHORT,
    }),
    category_image: Joi.any(),
});
type createCategory = {
    title: string;
    description: string;
};
export const createCategorySchema: ObjectSchema<createCategory> = Joi.object({
    title: Joi.string().trim().required().max(50).messages({
        "string.base": constants.error.ERROR_TITLE_STRING,
        "any.required": constants.error.ERROR_TITLE_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_MAX,
    }),
    description: Joi.string().trim().required().max(200).min(8).messages({
        "string.base": constants.error.ERROR_DESCRIPTION_STRING,
        "any.required": constants.error.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants.error.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants.error.ERROR_DESCRIPTION_TOO_SHORT,
    }),
});
type deleteCategory = {
    category_id: number;
};
export const deleteCategorySchema: ObjectSchema<deleteCategory> = Joi.object({
    category_id: Joi.number().required().messages({
        "number.base": constants.error.ERROR_CATEGORY_ID_NUMBER,
        "any.required": constants.error.ERROR_CATEGORY_ID_REQUIRED,
    }),
});

//type changeAvatar = {};
const categorySchema = {
    updateCategorySchema,
    createCategorySchema,
    deleteCategorySchema,
};
export default categorySchema;
