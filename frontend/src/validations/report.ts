import * as Yup from "yup";
import constants from "../constants";
export const createReportValidationSchema = Yup.object({
    content: Yup.string().trim().required(constants.error.ERROR_REPORT_CONTENT_REQUIRED),
    title: Yup.string().trim().required(constants.error.ERROR_TITLE_REQUIRED).max(100, constants.error.ERROR_TITLE_MAX),
});
