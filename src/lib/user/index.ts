// Endpoints: UT3yPtJlC1lJL6WBmQq1tDhqgoYLIZCuTisIgRCmcykTos7W
'use client';

import { adminMsApi } from "@/lib/axios-admin";
import * as types from "@/lib/user/types";

const BASE_URL = "usuarios/";

export async function getUsers({ page, pageSize }: types.UserListRequest): Promise<types.UserListResponse> {
    const response = await adminMsApi.get(BASE_URL, { params: { page, limite: pageSize } });
    return response.data;
}

export async function createUser(userData: types.UserCreateRequest): Promise<types.UserCreateResponse> {
    const response = await adminMsApi.post(BASE_URL, userData);
    return response.data;
}

export async function updateUser(userId: string, userData: types.UserUpdateRequest): Promise<null> {
    const response = await adminMsApi.patch(`${BASE_URL}${userId}/`, userData);
    return response.data;
}

export async function updateUserEmail(userId: string, emailData: types.UserUpdateEmailRequest): Promise<types.UserUpdateEmailResponse> {
    const response = await adminMsApi.post(`${BASE_URL}${userId}/email/`, emailData);
    return response.data;
}

export async function deleteUser(userId: string) {
    const response = await adminMsApi.patch(`${BASE_URL}${userId}/`, { habilitado: false });
    return response.data;
}
