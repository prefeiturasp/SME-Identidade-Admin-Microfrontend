// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ServicoIndisponivelError } from "@/lib/auth";
import { assinarSessao } from "@/lib/auth/sessao";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({ renovarSessao: vi.fn() }));

vi.mock("@/lib/auth", async (original) => ({
    ...(await original<typeof import("@/lib/auth")>()),
    renovarSessao: mocks.renovarSessao,
}));

function requisicao(comCookie = true) {
    const headers = new Headers();
    if (comCookie) {
        const valor = assinarSessao({ sid: "s1", login: "1234567", nome: "Ana", email: "", rf: "", exp: Math.floor(Date.now() / 1000) + 60 });
        headers.set("cookie", `admin_sessao=${valor}`);
    }
    return new NextRequest("http://localhost/api/sessao", { headers });
}

describe("GET /api/sessao", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("SESSION_SECRET", "x".repeat(32));
    });
    afterEach(() => vi.unstubAllEnvs());

    it("devolve 401 sem cookie válido", async () => {
        expect((await GET(requisicao(false))).status).toBe(401);
        expect(mocks.renovarSessao).not.toHaveBeenCalled();
    });

    it("renova e devolve o usuário quando a sessão está ativa", async () => {
        mocks.renovarSessao.mockResolvedValueOnce("valida");

        const resposta = await GET(requisicao());

        expect(resposta.status).toBe(200);
        expect(await resposta.json()).toEqual({ usuario: { nome: "Ana", login: "1234567" } });
        expect(mocks.renovarSessao).toHaveBeenCalledWith("s1");
    });

    it("devolve 401 quando a sessão foi encerrada", async () => {
        mocks.renovarSessao.mockResolvedValueOnce("encerrada");

        expect((await GET(requisicao())).status).toBe(401);
    });

    it("devolve 503 quando o SSO-MS está indisponível", async () => {
        mocks.renovarSessao.mockRejectedValueOnce(new ServicoIndisponivelError("fora"));

        expect((await GET(requisicao())).status).toBe(503);
    });
});
