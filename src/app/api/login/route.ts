import { NextRequest, NextResponse } from "next/server";

import {
    CredenciaisInvalidasError,
    encerrarSessao,
    login,
    temAcessoAdmin,
} from "@/lib/auth";
import { assinarSessao, NOME_COOKIE_SESSAO, opcoesCookie } from "@/lib/auth/sessao";

const DURACAO_PADRAO_SEGUNDOS = 8 * 60 * 60;

function erro(mensagem: string, status: number) {
    return NextResponse.json({ message: mensagem }, { status });
}

function expiracaoEmSegundos(expiraEm: string): number {
    const instante = new Date(expiraEm).getTime();
    if (Number.isFinite(instante)) return Math.floor(instante / 1000);
    return Math.floor(Date.now() / 1000) + DURACAO_PADRAO_SEGUNDOS;
}

/**
 * Autentica no SSO-MS pelo servidor, confere a role de acesso ao Admin e
 * grava o cookie de sessão assinado.
 */
export async function POST(request: NextRequest) {
    let corpo: unknown;
    try {
        corpo = await request.json();
    } catch {
        return erro("Informe login e senha.", 400);
    }

    const { login: usuario, senha } = (corpo ?? {}) as Record<string, unknown>;
    if (typeof usuario !== "string" || !usuario.trim() || typeof senha !== "string" || !senha) {
        return erro("Informe login e senha.", 400);
    }

    let resultado;
    try {
        resultado = await login({ login: usuario.trim(), senha });
    } catch (falha) {
        if (falha instanceof CredenciaisInvalidasError) return erro(falha.message, 401);
        return erro("Serviço de autenticação indisponível.", 503);
    }

    if (!temAcessoAdmin(resultado.roles)) {
        // A sessão criada no SSO-MS não será usada; encerrá-la evita deixá-la ativa.
        await encerrarSessao(resultado.sessaoId);
        return erro("Você não tem acesso ao Admin de Identidade.", 403);
    }

    const exp = expiracaoEmSegundos(resultado.expiraEm);
    let valorCookie;
    try {
        valorCookie = assinarSessao({ sid: resultado.sessaoId, ...resultado.usuario, exp });
    } catch {
        await encerrarSessao(resultado.sessaoId);
        return erro("Sessão do Admin não configurada.", 500);
    }

    const resposta = NextResponse.json({
        usuario: { nome: resultado.usuario.nome, login: resultado.usuario.login },
    });
    resposta.cookies.set(NOME_COOKIE_SESSAO, valorCookie, opcoesCookie(exp));
    return resposta;
}
