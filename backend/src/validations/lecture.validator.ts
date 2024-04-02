import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type AddLecture = {
    type: string;
    section_id: number;
    duration: string;
    description: string;
    title: string;
    quiz_group_id?: number;
    pass_percent?: string;
    is_time_limit?: string;
    video?: any;
};

export const AddLectureSchema: ObjectSchema<AddLecture> = Joi.object({
    type: Joi.string().trim().required().max(20).messages({
        "any.required": constants.error.ERROR_LECTURE_TYPE_REQUIRED,
        "string.base": constants.error.ERROR_LECTURE_TYPE_STRING,
        "string.max": constants.error.ERROR_LECTURE_TYPE_TOO_LONG,
    }),
    title: Joi.string().trim().required().max(100).messages({
        "any.required": constants.error.ERROR_TITLE_REQUIRED,
        "string.base": constants.error.ERROR_TITLE_STRING,
        "string.max": constants.error.ERROR_TITLE_MAX,
    }),
    description: Joi.string().trim().required().max(100).messages({
        "any.required": constants.error.ERROR_DESCRIPTION_REQUIRED,
        "string.base": constants.error.ERROR_DESCRIPTION_STRING,
        "string.max": constants.error.ERROR_DESCRIPTION_TOO_MAX,
    }),
    duration: Joi.number().required().positive().messages({
        "any.required": constants.error.ERROR_LECTURE_DURATION_REQUIRED,
        "number.base": constants.error.ERROR_LECTURE_DURATION_NUMBER,
        "number.positive": constants.error.ERROR_LECTURE_DURATION_POSITIVE,
    }),
    section_id: Joi.number().integer().required().messages({
        "any.required": constants.error.ERROR_SECTION_ID_REQUIRED,
        "number.base": constants.error.ERROR_SECTION_ID_NUMBER,
        "number.integer": constants.error.ERROR_SECTION_ID_INTEGER,
    }),
    quiz_group_id: Joi.number().messages({
        "number.base": constants.error.ERROR_QUIZ_GROUP_ID_INT,
    }),
    pass_percent: Joi.number().positive().messages({
        "number.base": constants.error.ERROR_SECTION_ID_NUMBER,
        "number.positive": constants.error.ERROR_LECTURE_PASS_PERCENT_POSITIVE,
    }),
    is_time_limit: Joi.boolean().messages({
        "boolean.base": constants.error.ERROR_LECTURE_TIME_LIMIT_BOOLEAN,
    }),
    video: Joi.any(),
});

type UpdateLeecture = {
    type: string;
    lecture_id: number;
    duration: string;
    description: string;
    title: string;
    quiz_group_id?: number;
    pass_percent?: string;
    is_time_limit?: string;
    video?: any;
};

export const UpdateLectureSchema: ObjectSchema<UpdateLeecture> = Joi.object({
    type: Joi.string().trim().required().max(20).messages({
        "any.required": constants.error.ERROR_LECTURE_TYPE_REQUIRED,
        "string.base": constants.error.ERROR_LECTURE_TYPE_STRING,
        "string.max": constants.error.ERROR_LECTURE_TYPE_TOO_LONG,
    }),
    title: Joi.string().trim().required().max(100).messages({
        "any.required": constants.error.ERROR_TITLE_REQUIRED,
        "string.base": constants.error.ERROR_TITLE_STRING,
        "string.max": constants.error.ERROR_TITLE_MAX,
    }),
    description: Joi.string().trim().required().max(100).messages({
        "any.required": constants.error.ERROR_DESCRIPTION_REQUIRED,
        "string.base": constants.error.ERROR_DESCRIPTION_STRING,
        "string.max": constants.error.ERROR_DESCRIPTION_TOO_MAX,
    }),
    duration: Joi.number().required().positive().messages({
        "any.required": constants.error.ERROR_LECTURE_DURATION_REQUIRED,
        "number.base": constants.error.ERROR_LECTURE_DURATION_NUMBER,
        "number.positive": constants.error.ERROR_LECTURE_DURATION_POSITIVE,
    }),
    lecture_id: Joi.number().integer().required().messages({
        "any.required": constants.error.ERROR_LECTURE_ID_REQUIRED,
        "number.base": constants.error.ERROR_LECTURE_ID_NUMBER,
        "number.integer": constants.error.ERROR_LECTURE_ID_INTEGER,
    }),
    quiz_group_id: Joi.number().messages({
        "number.base": constants.error.ERROR_QUIZ_GROUP_ID_INT,
    }),
    pass_percent: Joi.number().positive().messages({
        "number.base": constants.error.ERROR_SECTION_ID_NUMBER,
        "number.positive": constants.error.ERROR_LECTURE_PASS_PERCENT_POSITIVE,
    }),
    is_time_limit: Joi.boolean().messages({
        "boolean.base": constants.error.ERROR_LECTURE_TIME_LIMIT_BOOLEAN,
    }),
    video: Joi.any(),
});
