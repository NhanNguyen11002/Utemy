import Joi, { ObjectSchema } from "joi";
import constants from "../utils/constants";

type Lesson = {
    course_id: number;
    order: number;
    title: string;
    section_id: number;
};

export const LessonSchema: ObjectSchema<Lesson> = Joi.object({
    course_id: Joi.number().required(),
    order: Joi.number().required(),
    title: Joi.string().trim().required().max(100).messages({
        "any.required": constants.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.ERROR_COURSE_TITLE_STRING,
        "string.max": constants.ERROR_COURSE_TITLE_TOO_LONG,
    }),

    section_id: Joi.number().integer().required().messages({
        "any.required": constants.ERROR_SECTION_ID_REQUIRED,
        "number.base": constants.ERROR_SECTION_ID_NUMBER,
        "number.integer": constants.ERROR_SECTION_ID_INTEGER,
    }),
});

type UpdateLesson = {
    title: string;
};

export const UpdateLessonSchema: ObjectSchema<UpdateLesson> = Joi.object({
    title: Joi.string().trim().required().max(100).messages({
        "any.required": constants.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.ERROR_COURSE_TITLE_STRING,
        "string.max": constants.ERROR_COURSE_TITLE_TOO_LONG,
    }),
    video: Joi.string().strip(),
});
