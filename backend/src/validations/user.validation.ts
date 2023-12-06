import Joi, { ObjectSchema } from "joi";
import constants from "../utils/constants";

type updateProfile = {
    first_name: string;
    last_name: string;
    description: string;
};

export const updateProfileSchema: ObjectSchema<updateProfile> = Joi.object({
    first_name: Joi.string().trim().required().max(32).messages({
        "string.base": constants.ERROR_FIRST_NAME_STRING,
        "any.required": constants.ERROR_FIRST_NAME_REQUIRED,
        "string.max": constants.ERROR_FIRST_NAME_MAX,
    }),
    last_name: Joi.string().trim().required().max(32).messages({
        "string.base": constants.ERROR_LAST_NAME_STRING,
        "any.required": constants.ERROR_LAST_NAME_REQUIRED,
        "string.max": constants.ERROR_LAST_NAME_MAX,
    }),
    description: Joi.string().trim().required().max(2000).min(8).messages({
        "string.base": constants.ERROR_DESCRIPTION_STRING,
        "any.required": constants.ERROR_DESCRIPTION_REQUIRED,
        "string.max": constants.ERROR_DESCRIPTION_TOO_MAX,
        "string.min": constants.ERROR_DESCRIPTION_TOO_SHORT,
    }),
    email: Joi.string(),
});
//type changeAvatar = {};
const userSchema = {
    updateProfileSchema,
};
export default userSchema;
