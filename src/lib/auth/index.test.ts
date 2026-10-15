import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    CredenciaisInvalidasError,
    encerrarSessao,
    login,
    renovarSessao,
    ServicoIndisponivelError,
    temAcessoAdmin,
} from "@/lib/auth";

const postMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    ssoMsApi: { post: (...args: unknown[]) => postMock(...args) },
}));

function erroHttp(status: number) {
    return new AxiosError("falha", "ERR", undefined, undefined, {
        status,
        statusText: "",
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
    });
}

const respostaLogin = {
    nome: "João Silva",
    email: "joao@sme.prefeitura.sp.gov.br",
    rf: "1234567",
    roles: { realm_access: { roles: ["identidade-admin"] } },
    sessao: { sessao_id: "sessao-uuid", login: "1234567", expira_em: "2026-10-14T20:00:00Z" },
};

describe("login", () => {
    beforeEach(() => postMock.mockReset());

    it("chama o SSO-MS e devolve usuário, roles e sessão", async () => {
        postMock.mockResolvedValueOnce({ data: respostaLogin });

        const resultado = await login({ login: "1234567", senha: "segredo" });

        expect(postMock).toHaveBeenCalledWith("/identidade-sso/api/v1/login/", { login: "1234567", senha: "segredo" });
        expect(resultado).toEqual({
            usuario: { nome: "João Silva", login: "1234567", email: "joao@sme.prefeitura.sp.gov.br", rf: "1234567" },
            roles: ["identidade-admin"],
            sessaoId: "sessao-uuid",
            expiraEm: "2026-10-14T20:00:00Z",
        });
    });

    it("usa valores padrão quando faltam dados opcionais", async () => {
        postMock.mockResolvedValueOnce({ data: { sessao: { sessao_id: "s1", expira_em: "x" } } });

        const resultado = await login({ login: "abc", senha: "x" });

        expect(resultado.usuario).toEqual({ nome: "", login: "abc", email: "", rf: "" });
        expect(resultado.roles).toEqual([]);
    });

    it("traduz 401 para credenciais inválidas", async () => {
        postMock.mockRejectedValueOnce(erroHttp(401));

        await expect(login({ login: "a", senha: "b" })).rejects.toBeInstanceOf(CredenciaisInvalidasError);
    });

    it("traduz outras falhas para serviço indisponível", async () => {
        postMock.mockRejectedValueOnce(erroHttp(502));
        await expect(login({ login: "a", senha: "b" })).rejects.toBeInstanceOf(ServicoIndisponivelError);

        postMock.mockRejectedValueOnce(new Error("rede"));
        await expect(login({ login: "a", senha: "b" })).rejects.toBeInstanceOf(ServicoIndisponivelError);
    });

    it("trata login sem sessão criada como indisponibilidade", async () => {
        postMock.mockResolvedValueOnce({ data: { ...respostaLogin, sessao: null, sessao_erro: "Gateway indisponível" } });

        await expect(login({ login: "a", senha: "b" })).rejects.toBeInstanceOf(ServicoIndisponivelError);
    });
});

describe("renovarSessao", () => {
    beforeEach(() => postMock.mockReset());

    it("confirma sessão válida", async () => {
        postMock.mockResolvedValueOnce({ data: {} });

        await expect(renovarSessao("s 1")).resolves.toBe("valida");
        expect(postMock).toHaveBeenCalledWith("/identidade-sso/api/v1/sessoes/s%201/renovar/");
    });

    it("trata 404 e 409 como sessão encerrada", async () => {
        postMock.mockRejectedValueOnce(erroHttp(404));
        await expect(renovarSessao("s1")).resolves.toBe("encerrada");

        postMock.mockRejectedValueOnce(erroHttp(409));
        await expect(renovarSessao("s1")).resolves.toBe("encerrada");
    });

    it("propaga indisponibilidade do serviço", async () => {
        postMock.mockRejectedValueOnce(erroHttp(503));

        await expect(renovarSessao("s1")).rejects.toBeInstanceOf(ServicoIndisponivelError);
    });
});

describe("encerrarSessao", () => {
    beforeEach(() => postMock.mockReset());

    it("chama o logout global", async () => {
        postMock.mockResolvedValueOnce({ data: {} });

        await expect(encerrarSessao("s1")).resolves.toBe(true);
        expect(postMock).toHaveBeenCalledWith("/identidade-sso/api/v1/sessoes/s1/logout/");
    });

    it("não falha quando a sessão já não existe", async () => {
        postMock.mockRejectedValueOnce(erroHttp(404));

        await expect(encerrarSessao("s1")).resolves.toBe(false);
    });
});

describe("temAcessoAdmin", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("usa identidade-admin como role padrão", () => {
        vi.stubEnv("ADMIN_ROLE_ACESSO", "");

        expect(temAcessoAdmin(["default-roles-cotic", "identidade-admin"])).toBe(true);
        expect(temAcessoAdmin(["default-roles-cotic"])).toBe(false);
    });

    it("respeita a role configurada", () => {
        vi.stubEnv("ADMIN_ROLE_ACESSO", "cotic-admin");

        expect(temAcessoAdmin(["cotic-admin"])).toBe(true);
        expect(temAcessoAdmin(["identidade-admin"])).toBe(false);
    });
});
