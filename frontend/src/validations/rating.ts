import * as Yup from "yup";
import constants from "../constants";
export const ratingValidationSchema = Yup.object({
    content: Yup.string().trim().max(100, constants.error.ERROR_RATING_CONTENT_MAX),
});
