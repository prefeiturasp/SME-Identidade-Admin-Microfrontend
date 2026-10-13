import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { extrairMensagemErro, MENSAGEM_ERRO_PADRAO } from "./api-error";

function erroAxios(data: unknown) {
    return new AxiosError("falha", "ERR_BAD_REQUEST", undefined, undefined, {
        data,
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new AxiosHeaders() },
    });
}

describe("extrairMensagemErro", () => {
    it("usa a mensagem de domínio", () => {
        expect(extrairMensagemErro(erroAxios({ codigo: "recurso_ja_existe", mensagem: "Já existe." }))).toBe("Já existe.");
    });

    it("usa o detail de autenticação", () => {
        expect(extrairMensagemErro(erroAxios({ detail: "API Key inválida." }))).toBe("API Key inválida.");
    });

    it("usa a primeira mensagem de validação de campo", () => {
        expect(extrairMensagemErro(erroAxios({ nome: ["Este campo é obrigatório."] }))).toBe("Este campo é obrigatório.");
        expect(extrairMensagemErro(erroAxios({ non_field_errors: ["Informe ao menos um campo."] }))).toBe("Informe ao menos um campo.");
    });

    it("retorna a mensagem padrão quando não há corpo reconhecível", () => {
        expect(extrairMensagemErro(new Error("falha"))).toBe(MENSAGEM_ERRO_PADRAO);
        expect(extrairMensagemErro(erroAxios(undefined))).toBe(MENSAGEM_ERRO_PADRAO);
        expect(extrairMensagemErro(erroAxios("<html>"))).toBe(MENSAGEM_ERRO_PADRAO);
        expect(extrairMensagemErro(erroAxios({ outro: 1 }))).toBe(MENSAGEM_ERRO_PADRAO);
    });
});
