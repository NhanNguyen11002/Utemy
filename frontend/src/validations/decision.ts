import * as Yup from "yup";
import constants from "../constants";
export const createDecisionValidationSchema = Yup.object({
    content: Yup.string().trim().required(constants.error.ERROR_REPORT_CONTENT_REQUIRED),
});
