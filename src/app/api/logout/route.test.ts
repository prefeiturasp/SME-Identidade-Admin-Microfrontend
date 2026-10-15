// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { assinarSessao } from "@/lib/auth/sessao";
import { GET, POST } from "./route";

const mocks = vi.hoisted(() => ({ encerrarSessao: vi.fn() }));

vi.mock("@/lib/auth", () => ({ encerrarSessao: mocks.encerrarSessao }));

function requisicao(metodo: "GET" | "POST", comCookie = true) {
    const headers = new Headers();
    if (comCookie) {
        const valor = assinarSessao({ sid: "s1", login: "a", nome: "Ana", email: "", rf: "", exp: Math.floor(Date.now() / 1000) + 60 });
        headers.set("cookie", `admin_sessao=${valor}`);
    }
    return new NextRequest("http://localhost/api/logout", { method: metodo, headers });
}

describe("/api/logout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("SESSION_SECRET", "x".repeat(32));
    });
    afterEach(() => vi.unstubAllEnvs());

    it("POST encerra a sessão no SSO-MS e apaga o cookie", async () => {
        const resposta = await POST(requisicao("POST"));

        expect(resposta.status).toBe(204);
        expect(mocks.encerrarSessao).toHaveBeenCalledWith("s1");
        expect(resposta.cookies.get("admin_sessao")?.value).toBe("");
    });

    it("GET apaga o cookie e redireciona para o login com aviso de expiração", async () => {
        const resposta = await GET(requisicao("GET"));

        expect(resposta.status).toBe(307);
        expect(resposta.headers.get("location")).toBe("http://localhost/admin/login?expirada=1");
        expect(resposta.cookies.get("admin_sessao")?.value).toBe("");
    });

    it("respeita o caminho base configurado no redirecionamento", async () => {
        vi.stubEnv("NEXT_BASE_PATH", "/outro");

        const resposta = await GET(requisicao("GET"));

        expect(resposta.headers.get("location")).toBe("http://localhost/outro/login?expirada=1");
    });

    it("não chama o SSO-MS sem cookie válido", async () => {
        const resposta = await POST(requisicao("POST", false));

        expect(resposta.status).toBe(204);
        expect(mocks.encerrarSessao).not.toHaveBeenCalled();
    });
});
