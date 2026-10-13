'use client';

import { adminMsApi } from "@/lib/axios-admin";
import * as types from "@/lib/client/types";

const BASE_URL = "clientes/";

export async function getClients(): Promise<types.ClientData[]> {
    const response = await adminMsApi.get(BASE_URL);
    return response.data;
}
