import Joi, { ObjectSchema } from "joi";
import constants from "../utils/constants";

type Login = {
    email: string;
    password: string;
};
export const loginSchema: ObjectSchema<Login> = Joi.object({
    email: Joi.string()
        .regex(/^\S+@\S+\.\S+$/)
        .max(50)
        .trim()
        .required()
        .messages({
            "string.base": constants.ERROR_EMAIL_STRING,
            "any.required": constants.ERROR_EMAIL_REQUIRED,
            "string.regex": constants.ERROR_EMAIL_FORMAT,
            "string.max": constants.ERROR_EMAIL_MAX,
        }),
    password: Joi.string().trim().required().min(8).max(20).messages({
        "string.base": constants.ERROR_PASSWORD_STRING,
        "any.required": constants.ERROR_PASSWORD_REQUIRED,
        "string.max": constants.ERROR_PASSWORD_MAX,
        "string.min": constants.ERROR_PASSWORD_MIN,
    }),
});

type Signup = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
};

export const signupSchema: ObjectSchema<Signup> = Joi.object({
    email: Joi.string()
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .max(50)
        .messages({
            "string.base": constants.ERROR_EMAIL_STRING,
            "any.required": constants.ERROR_EMAIL_REQUIRED,
            "string.regex": constants.ERROR_EMAIL_FORMAT,
            "string.max": constants.ERROR_EMAIL_MAX,
        }),

    password: Joi.string().trim().required().min(8).max(20).messages({
        "string.base": constants.ERROR_PASSWORD_STRING,
        "any.required": constants.ERROR_PASSWORD_REQUIRED,
        "string.max": constants.ERROR_PASSWORD_MAX,
        "string.min": constants.ERROR_PASSWORD_MIN,
    }),

    first_name: Joi.string().trim().required().max(30).messages({
        "string.base": constants.ERROR_FIRST_NAME_STRING,
        "any.required": constants.ERROR_FIRST_NAME_REQUIRED,
        "string.max": constants.ERROR_FIRST_NAME_MAX,
    }),

    last_name: Joi.string().trim().required().max(30).messages({
        "string.base": constants.ERROR_LAST_NAME_STRING,
        "any.required": constants.ERROR_LAST_NAME_REQUIRED,
        "string.max": constants.ERROR_LAST_NAME_MAX,
    }),

    confirm_password: Joi.string().trim().valid(Joi.ref("password")).required().messages({
        "any.only": constants.ERROR_CONFIRM_PASSWORD,
        "any.required": constants.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
});
type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};
export const changePasswordSchema: ObjectSchema<ChangePassword> = Joi.object({
    current_password: Joi.string().trim().required().min(8).max(20).messages({
        "string.base": constants.ERROR_CURRENT_PASSWORD_STRING,
        "any.required": constants.ERROR_CURRENT_PASSWORD_REQUIRED,
        "string.max": constants.ERROR_CURRENT_PASSWORD_MAX,
        "string.min": constants.ERROR_CURRENT_PASSWORD_MIN,
    }),
    new_password: Joi.string().trim().required().min(8).max(20).messages({
        "string.base": constants.ERROR_NEW_PASSWORD_STRING,
        "any.required": constants.ERROR_NEW_PASSWORD_REQUIRED,
        "string.max": constants.ERROR_NEW_PASSWORD_MAX,
        "string.min": constants.ERROR_NEW_PASSWORD_MIN,
    }),
    confirm_password: Joi.string().trim().valid(Joi.ref("new_password")).required().messages({
        "any.only": constants.ERROR_CONFIRM_NEW_PASSWORD,
        "any.required": constants.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
});

type ResetPassword = {
    new_password: string;
    confirm_password: string;
    token: string;
};
export const resetPasswordSchema: ObjectSchema<ResetPassword> = Joi.object({
    new_password: Joi.string().trim().required().min(8).max(20).messages({
        "string.base": constants.ERROR_NEW_PASSWORD_STRING,
        "any.required": constants.ERROR_NEW_PASSWORD_REQUIRED,
        "string.max": constants.ERROR_NEW_PASSWORD_MAX,
        "string.min": constants.ERROR_NEW_PASSWORD_MIN,
    }),
    confirm_password: Joi.string().trim().valid(Joi.ref("new_password")).required().messages({
        "any.only": constants.ERROR_CONFIRM_NEW_PASSWORD,
        "any.required": constants.ERROR_CONFIRM_PASSWORD_REQUIRED,
    }),
    token: Joi.string().trim().required().messages({
        "string.base": constants.ERROR_TOKEN_STRING,
        "any.required": constants.ERROR_TOKEN_REQUIRED,
    }),
});
type ForgotPassword = {
    email: string;
};
export const forgotPasswordSchema: ObjectSchema<ForgotPassword> = Joi.object({
    email: Joi.string()
        .trim()
        .regex(/^\S+@\S+\.\S+$/)
        .required()
        .max(50)
        .messages({
            "string.base": constants.ERROR_EMAIL_STRING,
            "any.required": constants.ERROR_EMAIL_REQUIRED,
            "string.regex": constants.ERROR_EMAIL_FORMAT,
            "string.max": constants.ERROR_EMAIL_MAX,
        }),
});
const authSchema = {
    signupSchema,
    loginSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
export default authSchema;
