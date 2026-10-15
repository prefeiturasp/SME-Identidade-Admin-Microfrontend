import { NextRequest, NextResponse } from "next/server";

import { renovarSessao } from "@/lib/auth";
import { lerSessao, NOME_COOKIE_SESSAO } from "@/lib/auth/sessao";

/**
 * Confirma e renova a sessão no SSO-MS. Usada a cada troca de tela, já
 * que o layout protegido só é executado no carregamento completo.
 */
export async function GET(request: NextRequest) {
    const sessao = lerSessao(request.cookies.get(NOME_COOKIE_SESSAO)?.value);
    if (!sessao) return NextResponse.json({ message: "Sem sessão." }, { status: 401 });

    try {
        if ((await renovarSessao(sessao.sid)) === "encerrada") {
            return NextResponse.json({ message: "Sessão encerrada." }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ message: "Serviço de autenticação indisponível." }, { status: 503 });
    }

    return NextResponse.json({ usuario: { nome: sessao.nome, login: sessao.login } });
}
