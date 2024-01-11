import { ResponseSuccess, ResponseError, ResponseBase } from "../common/response";
import { sendMail } from "../common";
import configs from "../configs";
import bcrpyt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError, JwtPayload } from "jsonwebtoken";
import { IRequestWithId } from "../types/request";
import { Request } from "express";
import { setResetEmail, setSignupEmail } from "../configs/nodemailer.config";
import { MailOption } from "../types/sendmail";
import constants from "../constants";

const login = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email, password }: any = req.body;

        const isFoundUser = await configs.db.user.findFirst({
            where: {
                email: email,
                is_deleted: false,
            },
        });

        if (!isFoundUser) {
            return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        }

        const isUserPassword = await bcrpyt.compare(password, isFoundUser.password);

        if (!isUserPassword) return new ResponseError(400, constants.error.ERROR_WRONG_PASSWORD, false);
        if (!isFoundUser.is_verify) {
            const payload = {
                email: isFoundUser.email,
                id: isFoundUser.id,
            };

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = setSignupEmail(link);
            const mailOptions: MailOption = {
                from: "Utemy",
                to: `${isFoundUser.email}`,
                subject: "Utemy - Verification email",
                text: "You recieved message from Utemy",
                html: html,
            };
            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                return new ResponseSuccess(200, constants.success.SUCCESS_CHECK_MAIL, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        } else {
            const accessToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                    is_admin: isFoundUser.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                },
            );
            const refreshToken = jwt.sign(
                {
                    user_id: isFoundUser.id,
                    is_admin: isFoundUser.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_REFRESH_EXPIRED_TIME,
                },
            );
            return new ResponseSuccess(200, constants.success.SUCCESS_LOGIN, true, {
                accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const refreshAccessToken = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const refreshTokenRaw = req.headers.rftoken as string;
        const refreshToken = refreshTokenRaw.split(" ")[1];
        if (!refreshToken) return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        const isVerifyRefreshToken = jwt.verify(refreshToken, configs.general.JWT_SECRET_KEY) as JwtPayload;
        if (isVerifyRefreshToken) {
            const newAccessToken = jwt.sign(
                {
                    user_id: isVerifyRefreshToken.user_id,
                    is_admin: isVerifyRefreshToken.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                },
            );
            return new ResponseSuccess(200, constants.success.SUCCESS_REFRESH_TOKEN, true, {
                accessToken: newAccessToken,
            });
        } else {
            return new ResponseError(400, constants.error.ERROR_BAD_TOKEN, false);
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, constants.error.ERROR_LOGIN_AGAIN, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, constants.error.ERROR_LOGIN_AGAIN, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, constants.error.ERROR_LOGIN_AGAIN, false);
        }
        return new ResponseError(400, error as string, false);
    }
};
const signup = async (req: Request): Promise<ResponseBase> => {
    try {
        const { first_name, last_name, email, password, confirm_password }: any = req.body;
        if (password !== confirm_password) return new ResponseError(400, constants.error.ERROR_CONFIRM_PASSWORD, false);
        const isExistUser = await configs.db.user.findUnique({
            where: {
                email,
            },
        });
        if (isExistUser) {
            return new ResponseError(400, constants.error.ERROR_EMAIL_USED, false);
        } else {
            const hashedPassword = await bcrpyt.hash(password, configs.general.HASH_SALT);
            const createUser = await configs.db.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
            });
            if (createUser) {
                const payload = {
                    email: createUser.email,
                    id: createUser.id,
                };

                const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                });
                const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
                const html = setSignupEmail(link);
                const mailOptions: MailOption = {
                    from: "Utemy",
                    to: `${createUser.email}`,
                    subject: "Utemy - Verification email",
                    text: "You recieved message from Utemy",
                    html: html,
                };

                const isSendEmailSuccess = sendMail(mailOptions);
                if (isSendEmailSuccess) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_SIGNUP, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resendVerifyEmail = async (req: Request): Promise<ResponseBase> => {
    try {
        console.log("verify");
        const { email }: any = req.body;
        const isExistUser = await configs.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!isExistUser) {
            return new ResponseError(400, constants.error.ERROR_USER_NOT_FOUND, false);
        } else {
            const payload = {
                email: isExistUser.email,
                id: isExistUser.id,
            };
            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = setSignupEmail(link);
            const mailOptions: MailOption = {
                from: "Utemy",
                to: `${isExistUser.email}`,
                subject: "Utemy - Verification email",
                text: "You recieved message from Utemy",
                html: html,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                return new ResponseSuccess(200, constants.success.SUCCESS_CHECK_MAIL, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        console.log("verify", error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const verifyEmail = async (req: Request): Promise<ResponseBase> => {
    try {
        const { token } = req.params;
        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY) as JwtPayload;
        if (isVerifyToken) {
            const user = await configs.db.user.findUnique({
                where: {
                    email: isVerifyToken.email,
                },
            });
            if (user?.is_verify) {
                return new ResponseError(400, constants.error.ERROR_ALREADY_VERIFY, false);
            } else {
                const verifyUser = await configs.db.user.update({
                    where: {
                        email: user?.email,
                    },
                    data: {
                        is_verify: true,
                    },
                });
                if (verifyUser) {
                    const createCart = await configs.db.cart.create({
                        data: {
                            user_id: verifyUser.id,
                        },
                    });
                    return new ResponseSuccess(200, constants.success.SUCCESS_VERIFY_EMAIL, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            }
        } else {
            return new ResponseError(400, constants.error.ERROR_BAD_TOKEN, false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const forgotPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email } = req.body;
        const user = await configs.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        } else {
            const payload = {
                email: user.email,
                id: user.id,
            };

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = setResetEmail(link);
            const mailOptions: MailOption = {
                from: "Utemy",
                to: `${user.email}`,
                subject: "Utemy - Reset password email",
                text: "You recieved message from Utemy",
                html: html,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                const asignToken = await configs.db.user.update({
                    where: {
                        email,
                    },
                    data: {
                        token,
                    },
                });
                return new ResponseSuccess(200, constants.success.SUCCESS_FORGOT_PASSWORD, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resendForgotPasswordEmail = async (req: Request): Promise<ResponseBase> => {
    try {
        const { email } = req.body;
        const user = await configs.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        } else {
            const payload = {
                email: user.email,
                id: user.id,
            };

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY!, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = setResetEmail(link);
            const mailOptions: MailOption = {
                from: "Utemy",
                to: `${user.email}`,
                subject: "Utemy - Reset password email",
                text: "You recieved message from Utemy",
                html: html,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                const asignToken = await configs.db.user.update({
                    where: {
                        email,
                    },
                    data: {
                        token,
                    },
                });
                return new ResponseSuccess(200, constants.success.SUCCESS_FORGOT_PASSWORD, true);
            } else {
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const resetPassword = async (req: Request): Promise<ResponseBase> => {
    try {
        const { new_password, confirm_password, token } = req.body;
        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY) as JwtPayload;
        if (!isVerifyToken) {
            return new ResponseError(400, constants.error.ERROR_BAD_TOKEN, false);
        } else {
            const hashedPassword = await bcrpyt.hash(new_password, configs.general.HASH_SALT);
            if (hashedPassword) {
                const isFoundUser = await configs.db.user.findUnique({
                    where: {
                        email: isVerifyToken.email,
                    },
                });
                if (!isFoundUser) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
                else if (isFoundUser.token === token) {
                    const changePassword = await configs.db.user.update({
                        where: {
                            email: isFoundUser.email,
                        },
                        data: {
                            password: hashedPassword,
                            token: null,
                        },
                    });
                    if (changePassword) {
                        return new ResponseSuccess(200, constants.success.SUCCESS_RESET_PASSWORD, true);
                    } else {
                        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                    }
                } else {
                    return new ResponseError(400, constants.error.ERROR_BAD_TOKEN, false);
                }
            } else {
                console.log("fail");
                return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const changePassword = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const id = req.user_id;
        const isFoundUser = await configs.db.user.findUnique({
            where: {
                id,
            },
        });
        if (!isFoundUser) {
            return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        } else {
            const isOldPasswordValid = await bcrpyt.compare(current_password, isFoundUser.password);
            if (isOldPasswordValid) {
                const hashedNewPassword = await bcrpyt.hash(new_password, configs.general.HASH_SALT);
                const changePassword = await configs.db.user.update({
                    where: {
                        id,
                    },
                    data: {
                        password: hashedNewPassword,
                    },
                });
                if (changePassword) {
                    return new ResponseSuccess(200, constants.success.SUCCESS_CHANGE_PASSWORD, true);
                } else {
                    return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
                }
            } else {
                return new ResponseError(400, constants.error.ERROR_WRONG_CURRENT_PASSWORD, false);
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const getMe = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const id = req.user_id;
        const isFoundUser = await configs.db.user.findUnique({
            where: {
                id,
            },
        });
        if (isFoundUser) {
            const userInformation = {
                user_id: isFoundUser.id,
                email: isFoundUser.email,
                first_name: isFoundUser.first_name,
                last_name: isFoundUser.last_name,
                url_avatar: isFoundUser.url_avatar,
                description: isFoundUser.description,
                is_admin: isFoundUser.is_admin,
            };
            return new ResponseSuccess(200, constants.success.SUCCESS_REQUEST, true, userInformation);
        } else {
            return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
        }
    } catch (error) {
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const AuthServices = {
    login,
    refreshAccessToken,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    getMe,
    resendVerifyEmail,
    resendForgotPasswordEmail,
};
export default AuthServices;
