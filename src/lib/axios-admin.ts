'use client';

import axios from "axios";

type AdminConfig = {
    NEXT_PUBLIC_ADMIN_MS_URL?: string;
    NEXT_PUBLIC_ADMIN_CLIENT_ID?: string;
    NEXT_PUBLIC_ADMIN_CLIENT_SECRET?: string;
}

const adminConfig = (globalThis as typeof globalThis & {
    __ADMIN_CONFIG__?: AdminConfig;
}).__ADMIN_CONFIG__;

export const adminMsApi = axios.create({
    baseURL: adminConfig?.NEXT_PUBLIC_ADMIN_MS_URL ?? process.env.NEXT_PUBLIC_ADMIN_MS_URL,
    headers: {
        'X-Client-Id': adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? '',
        'X-Client-Secret': adminConfig?.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ?? process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET ?? '',
    }
});
