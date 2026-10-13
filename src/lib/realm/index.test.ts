import { beforeEach, describe, expect, it, vi } from "vitest";

import { adminMsApi } from "@/lib/axios-admin";
import { createRealm, getFinalidades, getRealms, updateRealm } from "./index";

describe("realm API", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("lista realms", async () => {
        const response = { data: [{ id: "r1", nome: "sme-apps", nome_exibicao: null, habilitado: true }] };
        const get = vi.spyOn(adminMsApi, "get").mockResolvedValue(response);

        await expect(getRealms()).resolves.toEqual(response.data);
        expect(get).toHaveBeenCalledWith("realms/");
    });

    it("cria realm", async () => {
        const response = { data: { mensagem: "Realm criado com sucesso." } };
        const post = vi.spyOn(adminMsApi, "post").mockResolvedValue(response);

        await expect(createRealm({ nome: "sme-apps", nome_exibicao: "SME Apps", habilitado: true, oficial: true })).resolves.toEqual(response.data);
        expect(post).toHaveBeenCalledWith("realms/", { nome: "sme-apps", nome_exibicao: "SME Apps", habilitado: true, oficial: true });
    });

    it("atualiza realm codificando o nome no path", async () => {
        const response = { data: { mensagem: "Realm atualizado com sucesso." } };
        const patch = vi.spyOn(adminMsApi, "patch").mockResolvedValue(response);

        await expect(updateRealm("sme apps", { habilitado: false })).resolves.toEqual(response.data);
        expect(patch).toHaveBeenCalledWith("realms/sme%20apps/", { habilitado: false });
    });

    it("lista finalidades de teste", async () => {
        const response = { data: { finalidades: ["Sandbox", "UX"], padrao: "Produção" } };
        const get = vi.spyOn(adminMsApi, "get").mockResolvedValue(response);

        await expect(getFinalidades()).resolves.toEqual(response.data);
        expect(get).toHaveBeenCalledWith("realms/finalidades/");
    });
});
