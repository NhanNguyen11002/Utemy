import * as Yup from "yup";
import constants from "../constants";

export const addQuizValidationSchema = Yup.object({
    question: Yup.string().trim().required(constants.error.ERROR_QUESTION_REQUIRED),
    type: Yup.number().required(constants.error.ERROR_TYPE_REQUIRED),
});
export const addQuizGroupValidationSchema = Yup.object({
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_REQUIRED),
});
