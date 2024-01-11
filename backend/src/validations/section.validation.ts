import Joi, { ObjectSchema } from "joi";
import constants from "../utils/constants";

type Section = {
    title: string;
    course_id: number;
};

export const SectionSchema: ObjectSchema<Section> = Joi.object({
    title: Joi.string().trim().required().max(100).messages({
        "any.required": constants.ERROR_COURSE_TITLE_REQUIRED,
        "string.base": constants.ERROR_COURSE_TITLE_STRING,
        "string.max": constants.ERROR_COURSE_TITLE_TOO_LONG,
    }),

    course_id: Joi.number().integer().required().messages({
        "any.required": constants.ERROR_COURSE_ID_REQUIRED,
        "number.base": constants.ERROR_COURSE_ID_NUMBER,
        "number.integer": constants.ERROR_COURSE_ID_INTEGER,
    }),
});

type UpdateSection = {
    title: string;
    section_id: number;
};

export const UpdateSectionSchema: ObjectSchema<UpdateSection> = Joi.object({
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
const sectionSchema = {
    SectionSchema,
    UpdateSectionSchema,
};
export default sectionSchema;
