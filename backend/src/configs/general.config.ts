/* eslint-disable prettier/prettier */
import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const general = {
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    BACKEND_DOMAIN_NAME: process.env.BACKEND_DOMAIN_NAME,
    PORT: parseInt(process.env.PORT || "3001"),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    TOKEN_ACCESS_EXPIRED_TIME: process.env.TOKEN_ACCESS_EXPIRED_TIME,
    TOKEN_REFRESH_EXPIRED_TIME: process.env.TOKEN_REFRESH_EXPIRED_TIME,
    HASH_SALT: parseInt(process.env.HASH_SALT as string),
    PAGE_SIZE: Number(process.env.PAGE_SIZE),
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    PASSWORD_SERVER: process.env.PASSWORD_SERVER,
    PATH_TO_PUBLIC_FOLDER_VIDEOS: path.join(process.cwd(), "/public/videos"),
    PATH_TO_IMAGES: path.join(process.cwd(), "/public/images"),
    TZ: process.env.TZ,
    vnp_TmnCode: process.env.VNP_TMN_CODE,
    vnp_HashSecret: process.env.VNP_HASH_SECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_Api: process.env.VNP_API,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    CERTIFIER_ID: process.env.CERTIFIER_ID,
};
