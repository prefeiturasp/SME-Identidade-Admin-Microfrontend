import { NextResponse, type NextRequest } from "next/server";

import { NOME_COOKIE_SESSAO } from "@/lib/auth/constantes";

/**
 * Triagem rápida: sem cookie de sessão, qualquer tela protegida vai para o
 * login. A validade da sessão e o acesso são conferidos no servidor.
 */
export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    if (pathname === "/login" || request.cookies.has(NOME_COOKIE_SESSAO)) {
        return NextResponse.next();
    }

    const destino = request.nextUrl.clone();
    destino.pathname = "/login";
    destino.search = "";
    destino.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(destino);
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*[.].*).*)"],
};
