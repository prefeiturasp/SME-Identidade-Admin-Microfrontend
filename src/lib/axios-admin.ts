'use client';

import axios from "axios";

type AdminConfig = {
    NEXT_PUBLIC_ADMIN_MS_URL?: string;
    NEXT_PUBLIC_ADMIN_CLIENT_ID?: string;
    NEXT_PUBLIC_ADMIN_CLIENT_SECRET?: string;
}

const getAdminConfig = (): AdminConfig | undefined => {
    if (globalThis.window === undefined) {
        return undefined;
    }

    return (globalThis.window as Window & { __ADMIN_CONFIG__?: AdminConfig }).__ADMIN_CONFIG__;
};

export const adminMsApi = axios.create();

adminMsApi.interceptors.request.use((config) => {
    const adminConfig = getAdminConfig();

    config.baseURL =
        adminConfig?.NEXT_PUBLIC_ADMIN_MS_URL ??
        process.env.NEXT_PUBLIC_ADMIN_MS_URL;
    config.headers.set(
        "X-Client-Id",
        adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_ID ??
        process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID ??
        "",
    );
    config.headers.set(
        "X-Client-Secret",
        adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ??
        process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ??
        "",
    );

    return config;
});
