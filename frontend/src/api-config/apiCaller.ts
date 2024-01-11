import axios from "axios";
import Cookies from "js-cookie";
import constants from "../constants";
import apis from "../api";

const axiosPublic = axios.create({
    baseURL: process.env.API_APP_BASE_URL || "http://localhost:3001",
});

const axiosInstance = axios.create();
axiosPublic.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config._retry) {
            config._retry = true;
            const response = await apis.authApis.refreshAccessToken();
            const accessToken = response.data.data.accessToken;
            if (accessToken) {
                Cookies.set("accessToken", accessToken);
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${accessToken}`,
                };
                return axiosInstance(config);
            }
        }
        if (error) {
            if (error.response.data.message === constants.error.ERROR_LOGIN_AGAIN) {
                Cookies.remove("refreshToken");
                Cookies.remove("accessToken");
                window.location.href = "/";
            }
            return Promise.reject(error.response);
        }
        // return error;
    },
);
axiosPublic.interceptors.request.use(
    async (config: any) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export const apiCaller = (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    return axiosPublic({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/api/${path}`,
        data,
    });
};
export const apiCallerVnpay = (method: string, path: string, data?: any) => {
    const refreshToken = Cookies.get("refreshToken");
    return axiosPublic({
        method,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            // "Origin:": "https://sandbox.vnpayment.vn",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/${path}`,
        data,
    });
};

export default apiCaller;
