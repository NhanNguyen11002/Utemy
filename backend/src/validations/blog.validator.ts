import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type updateBlog = {
    blog_id: number;
    title: string;
    content: string;
    is_published: string;
    url_image: Express.Multer.File;
    categories: Array<number>;
};
export const updateBlogSchema: ObjectSchema<updateBlog> = Joi.object({
    blog_id: Joi.number().required().messages({
        "number.base": constants.error.ERROR_BLOG_ID_NUMBER,
        "any.required": constants.error.ERROR_BLOG_ID_REQUIRED,
    }),
    title: Joi.string().trim().required().max(50).messages({
        "string.base": constants.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_BLOG_MAX,
    }),
    content: Joi.string().trim().required().max(1000).min(100).messages({
        "string.base": constants.error.ERROR_CONTENT_BLOG_STRING,
        "any.required": constants.error.ERROR_CONTENT_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_CONTENT_BLOG_MAX,
        "string.min": constants.error.ERROR_CONTENT_BLOG_SHORT,
    }),
    is_published: Joi.string().valid("true", "false").required().messages({
        "any.only": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
        "any.required": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
    }),
    url_image: Joi.string(),
    categories: Joi.string().required().messages({
        "any.required": constants.error.ERROR_BLOG_CATEGORIES_REQUIRED,
    }),
});
type createBlog = {
    title: string;
    content: string;
    categories: Array<number>;
};
export const createBlogSchema: ObjectSchema<createBlog> = Joi.object({
    title: Joi.string().trim().required().max(50).messages({
        "string.base": constants.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_BLOG_MAX,
    }),
    content: Joi.string().trim().required().max(1000).min(100).messages({
        "string.base": constants.error.ERROR_CONTENT_BLOG_STRING,
        "any.required": constants.error.ERROR_CONTENT_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_CONTENT_BLOG_MAX,
        "string.min": constants.error.ERROR_CONTENT_BLOG_SHORT,
    }),
    url_image: Joi.string(),
    categories: Joi.string().required().messages({
        "any.required": constants.error.ERROR_BLOG_CATEGORIES_REQUIRED,
    }),
});
type deleteBlog = {
    blog_id: number;
};
export const deleteBlogSchema: ObjectSchema<deleteBlog> = Joi.object({
    blog_id: Joi.number().required().messages({
        "number.base": constants.error.ERROR_BLOG_ID_NUMBER,
        "any.required": constants.error.ERROR_BLOG_ID_REQUIRED,
    }),
});

//type changeAvatar = {};
const blogSchema = {
    updateBlogSchema,
    createBlogSchema,
    deleteBlogSchema,
};
export default blogSchema;