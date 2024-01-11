export type Login = {
    email: string;
    password: string;
};

export type Signup = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
};
export type ForgotPassword = {
    email: string;
};
export type ResetPassword = {
    new_password: string;
    confirm_password: string;
    token: string;
};
export type ChangePassword = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};
export type Token = {
    accessToken: string;
    refreshToken: string;
};
