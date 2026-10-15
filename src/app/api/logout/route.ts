import { NextRequest, NextResponse } from "next/server";

import { encerrarSessao } from "@/lib/auth";
import { caminhoBase } from "@/lib/auth/caminho";
import { lerSessao, NOME_COOKIE_SESSAO, opcoesCookie } from "@/lib/auth/sessao";

async function encerrar(request: NextRequest) {
    const sessao = lerSessao(request.cookies.get(NOME_COOKIE_SESSAO)?.value);
    if (sessao) await encerrarSessao(sessao.sid);
}

function removerCookie(resposta: NextResponse) {
    resposta.cookies.set(NOME_COOKIE_SESSAO, "", opcoesCookie(0));
    return resposta;
}

/** Saída solicitada pelo usuário: encerra a sessão no SSO-MS (logout global). */
export async function POST(request: NextRequest) {
    await encerrar(request);
    return removerCookie(new NextResponse(null, { status: 204 }));
}

/** Saída forçada quando a sessão expirou ou foi encerrada em outro sistema. */
export async function GET(request: NextRequest) {
    await encerrar(request);

    // Em route handlers a URL da requisição não traz o basePath, por isso ele é incluído aqui.
    const destino = new URL(`${caminhoBase()}/login?expirada=1`, request.url);
    return removerCookie(NextResponse.redirect(destino));
}
