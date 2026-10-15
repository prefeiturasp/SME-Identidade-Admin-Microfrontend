import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { renovarSessao } from "@/lib/auth";
import { caminhoBase } from "@/lib/auth/caminho";
import { lerSessao, NOME_COOKIE_SESSAO } from "@/lib/auth/sessao";
import { RealmAtivoProvider } from "@/providers/RealmAtivoProvider";
import { SessaoProvider } from "@/providers/SessaoProvider";

export const dynamic = "force-dynamic";

/**
 * Guard das telas do Admin: exige cookie assinado e sessão ativa no SSO-MS.
 * O acesso (role) já foi conferido no login, quando o cookie foi emitido.
 */
export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sessao = lerSessao(cookies().get(NOME_COOKIE_SESSAO)?.value);
    if (!sessao) redirect("/login");

    if ((await renovarSessao(sessao.sid)) === "encerrada") redirect("/api/logout");

    return (
        <SessaoProvider usuario={{ nome: sessao.nome, login: sessao.login }} basePath={caminhoBase()}>
            <RealmAtivoProvider>
                <AppShell>{children}</AppShell>
            </RealmAtivoProvider>
        </SessaoProvider>
    );
}
