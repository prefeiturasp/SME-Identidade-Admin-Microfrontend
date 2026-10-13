'use client';

import axios from "axios";

declare global {
    interface Window {
        __ADMIN_CONFIG__?: {
            NEXT_PUBLIC_ADMIN_MS_URL?: string;
            NEXT_PUBLIC_ADMIN_CLIENT_ID?: string;
            NEXT_PUBLIC_ADMIN_CLIENT_SECRET?: string;
        };
    }
}

const adminConfig = typeof window === "undefined" ? undefined : window.__ADMIN_CONFIG__;

export const adminMsApi = axios.create({
    baseURL: adminConfig?.NEXT_PUBLIC_ADMIN_MS_URL ?? process.env.NEXT_PUBLIC_ADMIN_MS_URL,
    headers: {
        'X-Client-Id': adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? '',
        'X-Client-Secret': adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ?? process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ?? '',
    }
});
