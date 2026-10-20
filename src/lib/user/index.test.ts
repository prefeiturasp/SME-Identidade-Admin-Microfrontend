import { beforeEach, describe, expect, it, vi } from "vitest";

import { adminMsApi } from "@/lib/axios-admin";
import { createUser, deleteUser, getUsers, updateUser, updateUserEmail } from "./index";

describe("user API", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("lista usuários com paginação", async () => {
        const response = { data: { count: 1, page: 2, results: [] } };
        const get = vi.spyOn(adminMsApi, "get").mockResolvedValue(response);

        await expect(getUsers({ page: 2, pageSize: 10 })).resolves.toEqual(response.data);
        expect(get).toHaveBeenCalledWith("usuarios/", { params: { page: 2, limite: 10 } });
    });

    it("cria usuário", async () => {
        const user = {
            usuario: "123",
            nome: "Ana",
            sobrenome: "Lima",
            email: "ana@example.com",
            cpf: "12345678901",
            rf: null,
            tipo_usuario: "servidor",
        };
        const response = { data: { id: "u1" } };
        const post = vi.spyOn(adminMsApi, "post").mockResolvedValue(response);

        await expect(createUser(user)).resolves.toEqual(response.data);
        expect(post).toHaveBeenCalledWith("usuarios/", user);
    });

    it("atualiza dados e email do usuário", async () => {
        const patch = vi.spyOn(adminMsApi, "patch").mockResolvedValue({ data: null });
        const post = vi.spyOn(adminMsApi, "post").mockResolvedValue({ data: { email_alterado: true } });

        await expect(updateUser("u1", { nome: "Ana" })).resolves.toBeNull();
        await expect(updateUserEmail("u1", { email: "ana@example.com" })).resolves.toEqual({ email_alterado: true });

        expect(patch).toHaveBeenCalledWith("usuarios/u1/", { nome: "Ana" });
        expect(post).toHaveBeenCalledWith("usuarios/u1/email/", { email: "ana@example.com" });
    });

    it("desativa usuário", async () => {
        const response = { data: { habilitado: false } };
        const patch = vi.spyOn(adminMsApi, "patch").mockResolvedValue(response);

        await expect(deleteUser("u1")).resolves.toEqual(response.data);
        expect(patch).toHaveBeenCalledWith("usuarios/u1/", { habilitado: false });
    });
});
