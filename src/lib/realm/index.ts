'use client';

import { adminMsApi } from "@/lib/axios-admin";
import * as types from "@/lib/realm/types";

const BASE_URL = "realms/";

export async function getRealms(): Promise<types.RealmData[]> {
    const response = await adminMsApi.get(BASE_URL);
    return response.data;
}

export async function createRealm(realmData: types.RealmCreateRequest): Promise<types.MensagemResponse> {
    const response = await adminMsApi.post(BASE_URL, realmData);
    return response.data;
}

export async function updateRealm(nome: string, realmData: types.RealmUpdateRequest): Promise<types.MensagemResponse> {
    const response = await adminMsApi.patch(`${BASE_URL}${encodeURIComponent(nome)}/`, realmData);
    return response.data;
}

export async function getFinalidades(): Promise<types.FinalidadesResponse> {
    const response = await adminMsApi.get(`${BASE_URL}finalidades/`);
    return response.data;
}
