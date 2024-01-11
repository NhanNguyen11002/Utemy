import apiCaller from "../api-config/apiCaller";
import {
    Login as LoginType,
    Signup as SignupType,
    ForgotPassword as ForgotPasswordType,
    ResetPassword as ResetPasswordType,
    ChangePassword as ChangePasswordType,
} from "../types/auth";
const login = async (values: LoginType) => {
    const path = "auth/login";
    const data = {
        email: values.email,
        password: values.password,
    };
    const reponse = await apiCaller("POST", path, data);
    return reponse;
};
const refreshAccessToken = async () => {
    const path = "auth/refresh";
    const response = await apiCaller("GET", path);
    return response;
};
const getMe = async () => {
    const path = "auth/me";
    const response = await apiCaller("GET", path);
    return response;
};
const signup = async (values: SignupType) => {
    const path = "auth/signup";
    const data = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        confirm_password: values.confirm_password,
    };
    const response = await apiCaller("POST", path, data);
    return response;
};
const forgotPassword = async (values: ForgotPasswordType) => {
    const path = "auth/forgot-password";
    const data = {
        email: values.email,
    };
    const response = await apiCaller("POST", path, data);
    return response;
};
const resetPassword = async (values: ResetPasswordType) => {
    const path = "auth/reset-password";
    const data = {
        new_password: values.new_password,
        confirm_password: values.confirm_password,
        token: values.token,
    };
    const response = await apiCaller("PATCH", path, data);
    return response;
};
const changePassword = async (values: ChangePasswordType) => {
    const path = "auth/password";
    const data = {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
    };
    const response = await apiCaller("PATCH", path, data);
    return response;
};
const verifyEmail = async (token: string) => {
    const path = `auth/verify/${token}`;

    const response = await apiCaller("GET", path);
    return response;
};
const resendForgotPasswordEmail = async (email: string) => {
    const path = `auth/mail/forgot`;
    const data = {
        email,
    };
    const response = await apiCaller("POST", path, data);
    return response;
};
const resendVerifyEmail = async (email: string) => {
    const path = `auth/mail/verify`;
    const data = {
        email,
    };
    const response = await apiCaller("POST", path, data);
    return response;
};
const authApis = {
    login,
    refreshAccessToken,
    getMe,
    signup,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendForgotPasswordEmail,
    resendVerifyEmail,
};

export default authApis;
