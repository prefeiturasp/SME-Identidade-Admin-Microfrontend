import { createHmac, timingSafeEqual } from "node:crypto";

import { caminhoBase } from "@/lib/auth/caminho";

export { NOME_COOKIE_SESSAO } from "@/lib/auth/constantes";

const TAMANHO_MINIMO_SEGREDO = 32;

export interface DadosSessao {
    sid: string;
    login: string;
    nome: string;
    email: string;
    rf: string;
    exp: number;
}

function obterSegredo(): string {
    const segredo = process.env.SESSION_SECRET ?? "";
    if (segredo.length < TAMANHO_MINIMO_SEGREDO) {
        throw new Error(
            `SESSION_SECRET ausente ou com menos de ${TAMANHO_MINIMO_SEGREDO} caracteres.`
        );
    }
    return segredo;
}

function gerarAssinatura(conteudo: string): string {
    return createHmac("sha256", obterSegredo()).update(conteudo).digest("base64url");
}

/**
 * Serializa a sessão no formato `conteudo.assinatura`.
 *
 * A assinatura impede que o cookie seja montado à mão com um `sessao_id`
 * válido de alguém que não passou pela checagem de acesso no login.
 */
export function assinarSessao(dados: DadosSessao): string {
    const conteudo = Buffer.from(JSON.stringify(dados)).toString("base64url");
    return `${conteudo}.${gerarAssinatura(conteudo)}`;
}

/**
 * Devolve os dados da sessão somente se a assinatura confere e o prazo
 * do cookie não venceu; qualquer outro caso é tratado como sem sessão.
 */
export function lerSessao(valor: string | null | undefined): DadosSessao | null {
    if (!valor) return null;

    const [conteudo, assinatura] = valor.split(".");
    if (!conteudo || !assinatura) return null;

    try {
        const esperada = Buffer.from(gerarAssinatura(conteudo));
        const recebida = Buffer.from(assinatura);
        if (recebida.length !== esperada.length || !timingSafeEqual(recebida, esperada)) {
            return null;
        }

        const dados = JSON.parse(Buffer.from(conteudo, "base64url").toString()) as DadosSessao;
        if (typeof dados.exp !== "number" || dados.exp * 1000 <= Date.now()) return null;

        return dados;
    } catch {
        return null;
    }
}

export function opcoesCookie(exp: number) {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: caminhoBase() || "/",
        expires: new Date(exp * 1000),
    };
}
