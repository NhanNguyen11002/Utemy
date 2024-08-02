import axios from "axios";
import { general } from "./general.config";

const axiosCertificate = axios.create({
    baseURL: "https://api.certifier.io/v1",
});

export const apiCaller = (method: string, path: string, data?: any) => {
    return axiosCertificate({
        method,
        headers: {
            accept: "application/json",
            "Certifier-Version": "2022-10-26",
            "content-type": "application/json",
            authorization: "Bearer " + general.CERTIFIER_ID,
        },
        url: `/${path}`,
        data,
    });
};
