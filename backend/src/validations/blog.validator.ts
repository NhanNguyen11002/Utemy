import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type updateBlog = {
    blog_id: number;
    title: string;
    content: string;
    is_published: string;
    image_blog: Express.Multer.File;
    categories: Array<number>;
};
export const updateBlogSchema: ObjectSchema<updateBlog> = Joi.object({
    blog_id: Joi.number().required().messages({
        "number.base": constants.error.ERROR_BLOG_ID_NUMBER,
        "any.required": constants.error.ERROR_BLOG_ID_REQUIRED,
    }),
    title: Joi.string().trim().required().max(300).messages({
        "string.base": constants.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_BLOG_MAX,
    }),
    content: Joi.string().trim().required().min(100).messages({
        "string.base": constants.error.ERROR_CONTENT_BLOG_STRING,
        "any.required": constants.error.ERROR_CONTENT_BLOG_REQUIRED,
        // "string.max": constants.error.ERROR_CONTENT_BLOG_MAX,
        "string.min": constants.error.ERROR_CONTENT_BLOG_SHORT,
    }),
    // is_published: Joi.string().valid("true", "false").required().messages({
    //     "any.only": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
    //     "any.required": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
    // }),
    // url_image: Joi.string(),
    image_blog: Joi.string(),
    categories: Joi.string().required().messages({
        "any.required": constants.error.ERROR_BLOG_CATEGORIES_REQUIRED,
    }),
});
type createBlog = {
    title: string;
};
export const createBlogSchema: ObjectSchema<createBlog> = Joi.object({
    title: Joi.string().trim().required().max(50).messages({
        "string.base": constants.error.ERROR_TITLE_BLOG_STRING,
        "any.required": constants.error.ERROR_TITLE_BLOG_REQUIRED,
        "string.max": constants.error.ERROR_TITLE_BLOG_MAX,
    }),
    slug: Joi.string()
        .trim()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "any.required": constants.error.ERROR_BLOG_SLUG_REQUIRED,
            "string.base": constants.error.ERROR_BLOG_SLUG_STRING,
            "string.regex": constants.error.ERROR_BLOG_SLUG_MALFORMED,
        }),
    // url_image: Joi.string(),
});
type deleteBlog = {
    blog_id: number;
};
export const deleteBlogSchema: ObjectSchema<deleteBlog> = Joi.object({
    is_published: Joi.string().valid("true", "false").required().messages({
        "any.only": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
        "any.required": constants.error.ERROR_IS_PUBLISHED_BOOLEAN,
    }),
});

//type changeAvatar = {};
const blogSchema = {
    updateBlogSchema,
    createBlogSchema,
    deleteBlogSchema,
};
export default blogSchema;
