'use client';

import axios from "axios";

export const adminMsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_MS_URL,
    headers: {
        'X-Client-Id': process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID || '',
        'X-Client-Secret': process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET || '',
    }
});
