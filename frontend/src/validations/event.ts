import * as Yup from "yup";
import constants from "../constants";

export const createEventValidationSchema = Yup.object({
    name: Yup.string().trim().required(constants.error.ERROR_NAME_REQUIRED).max(50, constants.error.ERROR_NAME_MAX),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_EVENT_REQUIRED).max(500, constants.error.ERROR_DESCRIPTION_EVENT_MAX).min(8, constants.error.ERROR_DESCRIPTION_EVENT_MIN),
    start_date: Yup.date()
        .required(constants.error.ERROR_START_DATE_REQUIRED), // Ensure start_date is required
    end_date: Yup.date()
        .min(Yup.ref('start_date'), constants.error.ERROR_END_DATE_LATER_START_DATE)
        .required(constants.error.ERROR_END_DATE_REQUIRED), // Ensure end_date is required
});

export const editEventValidationSchema = Yup.object({
    name: Yup.string().trim().required(constants.error.ERROR_NAME_REQUIRED).max(50, constants.error.ERROR_NAME_MAX),
    description: Yup.string().trim().required(constants.error.ERROR_DESCRIPTION_EVENT_REQUIRED).max(500, constants.error.ERROR_DESCRIPTION_EVENT_MAX).min(8, constants.error.ERROR_DESCRIPTION_EVENT_MIN),
    start_date: Yup.date()
        .required(constants.error.ERROR_START_DATE_REQUIRED), // Ensure start_date is required
    end_date: Yup.date()
        .min(Yup.ref('start_date'), constants.error.ERROR_END_DATE_LATER_START_DATE)
        .required(constants.error.ERROR_END_DATE_REQUIRED), // Ensure end_date is required
});