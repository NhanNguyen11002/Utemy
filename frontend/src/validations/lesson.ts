import * as Yup from "yup";
import constants from "../constants";

export const addLessonValidationSchema = Yup.object({
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_REQUIRED),
});
export const addTestValidationSchema = Yup.object({
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    duration: Yup.number().positive().required(constants.error.ERROR_DURATION_REQUIRED),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_REQUIRED),
    pass_percent: Yup.number().positive().required(constants.error.ERROR_PASS_PERCENT_REQUIRED),
    is_time_limit: Yup.boolean().required(constants.error.ERROR_IS_TIME_LIMIT_REQUIRED),
    quiz_group_id: Yup.number().required(constants.error.ERROR_QUIZ_GROUP_ID_REQUIRED),
});
