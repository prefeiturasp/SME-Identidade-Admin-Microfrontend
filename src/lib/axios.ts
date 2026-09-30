import axios from "axios";

export const ssoMsApi = axios.create({
    baseURL: process.env.SSO_MS_URL,
    headers: {
        "X-API-Key": process.env.SSO_MS_API_KEY ?? "",
    },
});
