'use client';

import axios from "axios";

export const adminMsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_MS_URL,
    headers: {
        'X-Client-Id': process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID || '',
        'X-Client-Secret': process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET || '',
    }
});

// Sem realm definido, o Admin-MS opera no realm configurado nele.
export function definirRealmAtivo(nome: string | null) {
    if (nome) {
        adminMsApi.defaults.headers.common['X-Realm'] = nome;
    } else {
        delete adminMsApi.defaults.headers.common['X-Realm'];
    }
}
