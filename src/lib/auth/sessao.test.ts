import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { assinarSessao, lerSessao, opcoesCookie } from "./sessao";

const SEGREDO = "x".repeat(32);

function dados(exp = Math.floor(Date.now() / 1000) + 3600) {
    return { sid: "s1", login: "1234567", nome: "Ana", email: "ana@sme", rf: "1234567", exp };
}

describe("sessão assinada", () => {
    beforeEach(() => vi.stubEnv("SESSION_SECRET", SEGREDO));
    afterEach(() => vi.unstubAllEnvs());

    it("assina e lê os dados da sessão", () => {
        const sessao = dados();

        expect(lerSessao(assinarSessao(sessao))).toEqual(sessao);
    });

    it("recusa conteúdo adulterado", () => {
        const [, assinatura] = assinarSessao(dados()).split(".");
        const falso = Buffer.from(JSON.stringify({ ...dados(), sid: "outra" })).toString("base64url");

        expect(lerSessao(`${falso}.${assinatura}`)).toBeNull();
    });

    it("recusa assinatura gerada com outro segredo", () => {
        const valor = assinarSessao(dados());
        vi.stubEnv("SESSION_SECRET", "y".repeat(32));

        expect(lerSessao(valor)).toBeNull();
    });

    it("recusa sessão vencida, vazia ou mal formada", () => {
        expect(lerSessao(assinarSessao(dados(Math.floor(Date.now() / 1000) - 1)))).toBeNull();
        expect(lerSessao(undefined)).toBeNull();
        expect(lerSessao("sem-ponto")).toBeNull();
        expect(lerSessao("abc.def")).toBeNull();
    });

    it("exige segredo com tamanho mínimo", () => {
        vi.stubEnv("SESSION_SECRET", "curto");

        expect(() => assinarSessao(dados())).toThrow(/SESSION_SECRET/);
        expect(lerSessao("abc.def")).toBeNull();
    });

    it("define cookie httpOnly no caminho da aplicação", () => {
        vi.stubEnv("NEXT_BASE_PATH", "/admin");
        vi.stubEnv("NODE_ENV", "production");

        expect(opcoesCookie(10)).toEqual({
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/admin",
            expires: new Date(10_000),
        });

        vi.stubEnv("NEXT_BASE_PATH", "");
        expect(opcoesCookie(10).path).toBe("/");
    });
});
