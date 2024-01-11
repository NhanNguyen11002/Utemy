import * as Yup from "yup";
import constants from "../constants";

export const changePasswordValidationSchema = Yup.object({
    current_password: Yup.string().trim().required(constants.error.ERROR_NEW_PASSWORD_REQUIRED),
    new_password: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_PASSWORD_MIN)
        .max(32, constants.error.ERROR_NEW_PASSWORD_MAX)
        .required(constants.error.ERROR_NEW_PASSWORD_REQUIRED),
    confirm_password: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_PASSWORD_MIN)
        .max(32, constants.error.ERROR_NEW_PASSWORD_MAX)
        .required(constants.error.ERROR_CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref("new_password")], constants.error.ERROR_CONFIRM_NEW_PASSWORD),
});

export const updateProfileValidationSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_FIRST_NAME_MAX)
        .required(constants.error.ERROR_FIRST_NAME_REQUIRED),
    last_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_LAST_NAME_MAX)
        .required(constants.error.ERROR_LAST_NAME_REQUIRED),
    description: Yup.string()
        .trim()
        .min(8, constants.error.ERROR_DESCRIPTION_TOO_SHORT)
        .required(constants.error.ERROR_DESCRIPTION_REQUIRED),
});
export const editUserValidationSchema = Yup.object({
    first_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_FIRST_NAME_MAX)
        .required(constants.error.ERROR_FIRST_NAME_REQUIRED),
    last_name: Yup.string()
        .trim()
        .max(32, constants.error.ERROR_LAST_NAME_MAX)
        .required(constants.error.ERROR_LAST_NAME_REQUIRED),
    is_admin: Yup.boolean().required(constants.error.ERROR_ROLE_REQUIRED),
});
export const createUserValidationSchema = Yup.object({
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
    is_admin: Yup.boolean().required(constants.error.ERROR_ROLE_REQUIRED),
});
