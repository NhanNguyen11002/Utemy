import * as Yup from "yup";
import constants from "../constants";

export const addLessonValidationSchema = Yup.object({
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
    duration: Yup.string().trim().required(constants.error.ERROR_DURATION_REQUIRED),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_REQUIRED),
});
