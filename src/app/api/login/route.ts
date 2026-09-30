import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

/**
 * BFF de login: recebe usuário/senha do formulário (ainda não implementado
 * na UI) e repassa ao SSO-Microsservico a partir do servidor, mantendo a
 * API Key fora do browser. O cookie de sessão do Next.js será adicionado
 * quando a tela de login real for construída.
 */
export async function POST(request: NextRequest) {
    const { login: usuario, senha } = await request.json();

    try {
        const sessao = await login({ login: usuario, senha });
        return NextResponse.json(sessao, { status: 200 });
    } catch {
        return NextResponse.json(
            { message: "Login ou senha inválidos." },
            { status: 401 }
        );
    }
}
