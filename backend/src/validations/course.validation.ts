import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type enrolledCourse = {
    course_id: number;
};
const enrolledCourseSchema: ObjectSchema<enrolledCourse> = Joi.object({
    course_id: Joi.number().required().integer().messages({
        "number.base": constants.error.ERROR_COURSE_ID_NUMBER,
        "number.integer": constants.error.ERROR_COURSE_ID_INTEGER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
    }),
});

type CreateCourse = {
    title: string;
    slug: string;
    summary: string;
    description: string;
    // thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
    price: number;
};

export const createCourseSchema: ObjectSchema<CreateCourse> = Joi.object({
    title: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_TITLE_STRING,
    }),
    slug: Joi.string()
        .trim()
        .required()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .messages({
            "any.required": constants.error.ERROR_COURSE_SLUG_REQUIRED,
            "string.base": constants.error.ERROR_COURSE_SLUG_STRING,
            "string.regex": constants.error.ERROR_COURSE_SLUG_MALFORMED,
        }),

    description: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_DESCRIPTION_STRING,
    }),

    summary: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_SUMMARY_STRING,
    }),

    categories: Joi.string().required().messages({
        "any.required": constants.error.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),
    requirement: Joi.string(),
    study: Joi.string(),

    // thumbnail: Joi.binary().required().messages({
    //     "any.required": constants.error.ERROR_COURSE_THUMBNAIL_REQUIRED,
    // }),

    price: Joi.number().required().positive().messages({
        "any.required": constants.error.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants.error.ERROR_COURSE_PRICE_NUMBER,
        "number.positive": constants.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
});

type UpdateCourse = {
    //id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
    thumbnail: Express.Multer.File;
    categories: Array<number>;
    status: boolean;
    price: number;
};

const updateCourseSchema: ObjectSchema<UpdateCourse> = Joi.object({
    course_id: Joi.number(),
    title: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_TITLE_REQUIRED,
    }),
    slug: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_SLUG_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_SLUG_STRING,
        "string.regex": constants.error.ERROR_COURSE_SLUG_MALFORMED,
    }),

    description: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_DESCRIPTION_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_DESCRIPTION_STRING,
    }),

    summary: Joi.string().trim().required().messages({
        "any.required": constants.error.ERROR_COURSE_SUMMARY_REQUIRED,
        "string.base": constants.error.ERROR_COURSE_SUMMARY_STRING,
    }),

    categories: Joi.string().required().messages({
        "any.required": constants.error.ERROR_COURSE_CATEGORIES_REQUIRED,
    }),
    requirement: Joi.string(),
    study: Joi.string(),

    thumbnail: Joi.string(),
    price: Joi.number().required().positive().messages({
        "any.required": constants.error.ERROR_COURSE_PRICE_REQUIRED,
        "number.base": constants.error.ERROR_COURSE_PRICE_NUMBER,
        "number.positive": constants.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
});

type createRating = {
    score: number;
    content: string;
};
const createRatingSchema: ObjectSchema<createRating> = Joi.object({
    score: Joi.number().required().integer().min(1).max(5).messages({
        "number.integer": constants.error.ERROR_RATING_SCORE_INT,
        "number.base": constants.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
        "number.max": constants.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants.error.ERROR_RATING_SCORE_MIN,
    }),
    content: Joi.string().trim().max(300).messages({
        "string.base": constants.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants.error.ERROR_RATING_CONTENT_STRING,
    }),
});

type editRating = {
    rating_id: number;
    score: number;
    content: string;
};
const editRatingSchema: ObjectSchema<editRating> = Joi.object({
    rating_id: Joi.number().required().integer().messages({
        "number.integer": constants.error.ERROR_RATING_ID_INT,
        "number.base": constants.error.ERROR_RATING_ID_NUMBER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
    }),
    score: Joi.number().required().integer().min(1).max(5).messages({
        "number.integer": constants.error.ERROR_RATING_SCORE_INT,
        "number.base": constants.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
        "number.max": constants.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants.error.ERROR_RATING_SCORE_MIN,
    }),
    content: Joi.string().trim().max(300).messages({
        "string.base": constants.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants.error.ERROR_RATING_CONTENT_MAX,
    }),
});
type deleteRating = {
    rating_id: number;
};
const deleteRatingSchema: ObjectSchema<deleteRating> = Joi.object({
    rating_id: Joi.number().required().integer().messages({
        "number.integer": constants.error.ERROR_RATING_ID_INT,
        "number.base": constants.error.ERROR_RATING_ID_NUMBER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
    }),
});
type addPromotion = {
    sale_until: Date;
    sale_price: number;
    course_id: number;
};
const addPromotionSchema: ObjectSchema<addPromotion> = Joi.object({
    course_id: Joi.number().required().integer().messages({
        "number.integer": constants.error.ERROR_COURSE_ID_INTEGER,
        "number.base": constants.error.ERROR_COURSE_ID_NUMBER,
        "any.required": constants.error.ERROR_COURSE_ID_REQUIRED,
    }),
    sale_price: Joi.number().required().positive().messages({
        "number.base": constants.error.ERROR_SALE_PRICE_NUMBER,
        "any.required": constants.error.ERROR_SALE_PRICE_REQUIRED,
        "number.positive": constants.error.ERROR_COURSE_PRICE_POSITIVE,
    }),
    sale_until: Joi.date().required().min("now").messages({
        "date.base": constants.error.ERROR_SALE_UNTIL_DATE,
        "any.required": constants.error.ERROR_SALE_UNTIL_REQUIRED,
        "date.min": constants.error.ERROR_SALE_UNTIL_MIN,
    }),
});

const courseSchema = {
    enrolledCourseSchema,
    createCourseSchema,
    updateCourseSchema,
    createRatingSchema,
    editRatingSchema,
    deleteRatingSchema,
    addPromotionSchema,
};
export default courseSchema;
