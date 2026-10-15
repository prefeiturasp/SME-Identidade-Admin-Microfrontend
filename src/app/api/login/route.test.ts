// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CredenciaisInvalidasError, ServicoIndisponivelError } from "@/lib/auth";
import { lerSessao } from "@/lib/auth/sessao";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({ login: vi.fn(), encerrarSessao: vi.fn() }));

vi.mock("@/lib/auth", async (original) => ({
    ...(await original<typeof import("@/lib/auth")>()),
    login: mocks.login,
    encerrarSessao: mocks.encerrarSessao,
}));

function requisicao(corpo: unknown) {
    return new NextRequest("http://localhost/admin/api/login", {
        method: "POST",
        body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
    });
}

const resultado = {
    usuario: { nome: "Ana", login: "1234567", email: "ana@sme", rf: "1234567" },
    roles: ["identidade-admin"],
    sessaoId: "s1",
    expiraEm: new Date(Date.now() + 3600_000).toISOString(),
};

describe("POST /api/login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("SESSION_SECRET", "x".repeat(32));
        vi.stubEnv("ADMIN_ROLE_ACESSO", "");
    });
    afterEach(() => vi.unstubAllEnvs());

    it("recusa corpo inválido", async () => {
        expect((await POST(requisicao("{"))).status).toBe(400);
        expect((await POST(requisicao({ login: " ", senha: "x" }))).status).toBe(400);
        expect(mocks.login).not.toHaveBeenCalled();
    });

    it("devolve 401 para credenciais inválidas", async () => {
        mocks.login.mockRejectedValueOnce(new CredenciaisInvalidasError("Login ou senha inválidos."));

        const resposta = await POST(requisicao({ login: "a", senha: "b" }));

        expect(resposta.status).toBe(401);
        expect(await resposta.json()).toEqual({ message: "Login ou senha inválidos." });
    });

    it("devolve 503 quando o serviço está indisponível", async () => {
        mocks.login.mockRejectedValueOnce(new ServicoIndisponivelError("fora"));

        expect((await POST(requisicao({ login: "a", senha: "b" }))).status).toBe(503);
    });

    it("nega acesso sem a role e encerra a sessão criada", async () => {
        mocks.login.mockResolvedValueOnce({ ...resultado, roles: ["default-roles-cotic"] });

        const resposta = await POST(requisicao({ login: "a", senha: "b" }));

        expect(resposta.status).toBe(403);
        expect(await resposta.json()).toEqual({ message: "Você não tem acesso ao Admin de Identidade." });
        expect(mocks.encerrarSessao).toHaveBeenCalledWith("s1");
        expect(resposta.cookies.get("admin_sessao")).toBeUndefined();
    });

    it("grava o cookie de sessão assinado no sucesso", async () => {
        mocks.login.mockResolvedValueOnce(resultado);

        const resposta = await POST(requisicao({ login: " 1234567 ", senha: "b" }));

        expect(resposta.status).toBe(200);
        expect(mocks.login).toHaveBeenCalledWith({ login: "1234567", senha: "b" });
        expect(await resposta.json()).toEqual({ usuario: { nome: "Ana", login: "1234567" } });
        expect(resposta.headers.get("set-cookie")).toMatch(/admin_sessao=.+HttpOnly/i);
        expect(lerSessao(resposta.cookies.get("admin_sessao")?.value)).toMatchObject({ sid: "s1", nome: "Ana" });
    });

    it("usa duração padrão quando a expiração vem inválida", async () => {
        mocks.login.mockResolvedValueOnce({ ...resultado, expiraEm: "invalida" });

        const resposta = await POST(requisicao({ login: "a", senha: "b" }));

        expect(lerSessao(resposta.cookies.get("admin_sessao")?.value)).not.toBeNull();
    });

    it("devolve 500 e encerra a sessão se o segredo não está configurado", async () => {
        vi.stubEnv("SESSION_SECRET", "");
        mocks.login.mockResolvedValueOnce(resultado);

        expect((await POST(requisicao({ login: "a", senha: "b" }))).status).toBe(500);
        expect(mocks.encerrarSessao).toHaveBeenCalledWith("s1");
    });
});
