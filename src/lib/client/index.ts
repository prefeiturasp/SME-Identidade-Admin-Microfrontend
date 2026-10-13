import { adminMsApi } from "../axios-admin";
import * as types from "./types";

const BASE_URL = "clientes/";

export async function getClients(): Promise<types.TClientListResponse> {
    const response = await adminMsApi.get(BASE_URL);
    return response.data;
}

export async function createClient(clientData: types.TClientCreateRequest): Promise<types.TClientAdmin> {
    const response = await adminMsApi.post(BASE_URL, clientData);
    return response.data;
}

export async function updateClient(id: string, clientData: types.TClientPatchRequest): Promise<null> {
    const response = await adminMsApi.patch(`${BASE_URL}${id}/`, clientData);
    return response.data;
}

export async function disableClient(id: string): Promise<null> {
    const response = await adminMsApi.patch(`${BASE_URL}${id}/`, { habilitado: false });
    return response.data;
}

export async function rotateClientSecret(clientId: string): Promise<types.TClientRotateSecretResponse> {
    const response = await adminMsApi.post(`${BASE_URL}${clientId}/secret/rotacionar/`);
    return response.data;
}
