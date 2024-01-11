import Joi, { ObjectSchema } from "joi";
import constants from "../constants";

type createFeedback = {
    content: string;
    score: number;
};
const createFeedbackSchema: ObjectSchema<createFeedback> = Joi.object({
    content: Joi.string().trim().max(300).messages({
        "string.base": constants.error.ERROR_RATING_CONTENT_STRING,
        "string.max": constants.error.ERROR_RATING_CONTENT_MAX,
    }),
    score: Joi.number().integer().required().messages({
        "any.required": constants.error.ERROR_RATING_SCORE_REQUIRED,
        "number.integer": constants.error.ERROR_RATING_SCORE_INT,
        "number.max": constants.error.ERROR_RATING_SCORE_MAX,
        "number.min": constants.error.ERROR_RATING_SCORE_MIN,
    })
});

const feedbackSchema = {
    createFeedbackSchema,
};
export default feedbackSchema;
