import * as Yup from "yup";
import constants from "../constants";

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email()
        .required(constants.error.ERROR_EMAIL_REQUIRED)
        .max(50, constants.error.ERROR_EMAIL_MAX),
    password: Yup.string()
        .trim()
        .required(constants.error.ERROR_PASSWORD_REQUIRED)
        .max(20, constants.error.ERROR_PASSWORD_MAX)
        .min(8, constants.error.ERROR_PASSWORD_MIN),
});

export const signupValidationSchema = Yup.object({
    email: Yup.string().trim().email().required(constants.error.ERROR_EMAIL_REQUIRED),
    password: Yup.string()
        .trim()
        .required(constants.error.ERROR_PASSWORD_REQUIRED)
        .max(20, constants.error.ERROR_PASSWORD_MAX)
        .min(8, constants.error.ERROR_PASSWORD_MIN),
    confirm_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("password")], constants.error.ERROR_CONFIRM_PASSWORD),
    first_name: Yup.string()
        .trim()
        .required(constants.error.ERROR_FIRST_NAME_REQUIRED)
        .max(30, constants.error.ERROR_FIRST_NAME_MAX),
    last_name: Yup.string()
        .trim()
        .required(constants.error.ERROR_LAST_NAME_REQUIRED)
        .max(30, constants.error.ERROR_LAST_NAME_MAX),
});

export const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email()
        .required(constants.error.ERROR_EMAIL_REQUIRED)
        .max(50, constants.error.ERROR_EMAIL_MAX),
});
export const resetPasswordValidationSchema = Yup.object({
    new_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_NEW_PASSWORD_REQUIRED)
        .max(20, constants.error.ERROR_NEW_PASSWORD_MAX)
        .min(8, constants.error.ERROR_NEW_PASSWORD_MIN),
    confirm_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("new_password")], constants.error.ERROR_CONFIRM_NEW_PASSWORD),
});
export const changePasswordValidationSchema = Yup.object({
    current_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_CURRENT_PASSWORD_REQUIRED)
        .max(20, constants.error.ERROR_CURRENT_PASSWORD_MAX)
        .min(8, constants.error.ERROR_CURRENT_PASSWORD_MIN),

    new_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_NEW_PASSWORD_REQUIRED)
        .max(20, constants.error.ERROR_NEW_PASSWORD_MAX)
        .min(8, constants.error.ERROR_NEW_PASSWORD_MIN),
    confirm_password: Yup.string()
        .trim()
        .required(constants.error.ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("new_password")], constants.error.ERROR_CONFIRM_NEW_PASSWORD),
});
