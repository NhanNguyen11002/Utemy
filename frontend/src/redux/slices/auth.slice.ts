import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    Token as TokenType,
    Login as LoginType,
    Signup as SignupType,
    ForgotPassword as ForgotPasswordType,
    ResetPassword as ResetPasswordType,
    ChangePassword as ChangePasswordType,
} from "../../types/auth";
import { User } from "../../types/user";
import { Response } from "../../types/response";
import { AppDispatch } from "../store";
import apis from "../../api";
import Cookies from "js-cookie";
type AuthSliceType = {
    user: User;
    isLogin: boolean;
    isLoading: boolean;
    error: string;
    success: string;
};

const initialState: AuthSliceType = {
    user: {
        email: "",
        first_name: "",
        last_name: "",
        user_id: undefined,
        url_avatar: "",
        description: "",
        is_admin: false,
    },
    isLogin: false,
    isLoading: false,
    error: "",
    success: "",
};
export const login = createAsyncThunk<Response<TokenType>, LoginType, { rejectValue: Response<null> }>(
    "auth/login",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.login(body);
            return response.data as Response<TokenType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

export const signup = createAsyncThunk<Response<null>, SignupType, { rejectValue: Response<null> }>(
    "auth/signup",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.signup(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const forgotPassword = createAsyncThunk<Response<null>, ForgotPasswordType, { rejectValue: Response<null> }>(
    "auth/forgot-password",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.forgotPassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const resetPassword = createAsyncThunk<Response<null>, ResetPasswordType, { rejectValue: Response<null> }>(
    "auth/reset-password",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.resetPassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const changePassword = createAsyncThunk<Response<null>, ChangePasswordType, { rejectValue: Response<null> }>(
    "auth/password",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.changePassword(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const verifyEmail = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "auth/verify",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.verifyEmail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const resendVerifyEmail = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "auth/mail/verify",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.resendVerifyEmail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const resendForgotPasswordEmail = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "auth/mail/forgot",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.authApis.resendForgotPasswordEmail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user.description = action.payload.description;
            state.user.email = action.payload.email;
            state.user.first_name = action.payload.first_name;
            state.user.last_name = action.payload.last_name;
            state.user.user_id = action.payload.user_id;
            state.user.url_avatar = action.payload.url_avatar;
            state.user.is_admin = action.payload.is_admin;
            state.isLogin = true;
        },
        setLogout: (state) => {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            state.isLogin = false;
        },
        setEmail: (state, action) => {
            state.user.email = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            Cookies.set("accessToken", action.payload.data?.accessToken as string);
            Cookies.set("refreshToken", action.payload.data?.refreshToken as string);

            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(verifyEmail.pending, (state) => {
            state.error = "";
            state.success = "";
            state.isLoading = true;
        });
        builder.addCase(verifyEmail.fulfilled, (state, action) => {
            state.success = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });
        builder.addCase(resendForgotPasswordEmail.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resendForgotPasswordEmail.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendForgotPasswordEmail.rejected, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendVerifyEmail.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resendVerifyEmail.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(resendVerifyEmail.rejected, (state, action) => {
            state.isLoading = false;
        });
    },
});

export const { setUser, setLogout, setEmail } = authSlice.actions;

export default authSlice.reducer;

export const getMe = () => async (dispatch: AppDispatch) => {
    try {
        const response = await apis.authApis.getMe();
        if (response.data.status_code >= 200 && response.data.status_code <= 299) {
            dispatch(setUser(response.data.data));
        } else {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            window.location.href = "/login";
        }
    } catch (error) {}
};
export const logout = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(
            setUser({
                url_avatar: "",
                first_name: "",
                last_name: "",
                email: "",
                user_id: undefined,
                description: "",
                is_admin: false,
            }),
        );
        dispatch(setLogout());
    } catch (error) {
        console.log(error);
    }
};
export const refreshToken = async () => {
    try {
        const response = await apis.authApis.refreshAccessToken();

        if (response) {
            if (response.status >= 200 && response.status <= 299) {
                Cookies.set("accessToken", response.data.data.accessToken);
            } else {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.location.href = "/login";
            }
        }
    } catch (error: any) {}
};
