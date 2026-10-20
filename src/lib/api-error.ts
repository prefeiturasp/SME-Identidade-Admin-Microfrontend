import { isAxiosError } from "axios";

export const MENSAGEM_ERRO_PADRAO = "Ocorreu um erro inesperado";

// A API responde erros em três formatos: {mensagem}, {detail} e
// {campo: [mensagens]}; devolve a primeira mensagem legível encontrada.
export function extrairMensagemErro(error: unknown): string {
    if (!isAxiosError(error)) return MENSAGEM_ERRO_PADRAO;

    const data = error.response?.data;
    if (!data || typeof data !== "object") return MENSAGEM_ERRO_PADRAO;

    if (typeof data.mensagem === "string") return data.mensagem;
    if (typeof data.detail === "string") return data.detail;

    for (const valor of Object.values(data)) {
        if (Array.isArray(valor) && typeof valor[0] === "string") return valor[0];
    }

    return MENSAGEM_ERRO_PADRAO;
}
