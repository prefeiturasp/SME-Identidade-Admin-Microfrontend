// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, middleware } from "./middleware";

function requisicao(caminho: string, comCookie = false) {
    const headers = new Headers();
    if (comCookie) headers.set("cookie", "admin_sessao=qualquer");
    return new NextRequest(`http://localhost${caminho}`, { headers });
}

describe("middleware", () => {
    it("redireciona para o login preservando o destino", () => {
        const resposta = middleware(requisicao("/sistemas?page=2"));

        expect(resposta.status).toBe(307);
        expect(resposta.headers.get("location")).toBe(
            "http://localhost/login?next=%2Fsistemas%3Fpage%3D2"
        );
    });

    it("deixa passar com cookie de sessão", () => {
        const resposta = middleware(requisicao("/dashboard", true));

        expect(resposta.headers.get("location")).toBeNull();
        expect(resposta.headers.get("x-middleware-next")).toBe("1");
    });

    it("deixa a tela de login sempre acessível", () => {
        const resposta = middleware(requisicao("/login"));

        expect(resposta.headers.get("location")).toBeNull();
    });

    it("não intercepta rotas de API nem arquivos estáticos", () => {
        expect(config.matcher[0]).toContain("api");
        expect(config.matcher[0]).toContain(".*[.].*");
    });
});
