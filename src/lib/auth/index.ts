import { ssoMsApi } from "@/lib/axios";
import type { Sessao } from "@/types/auth";

interface LoginPayload {
    login: string;
    senha: string;
}

/**
 * Chama o SSO-Microsservico (POST /identidade-sso/api/v1/login/) para
 * autenticar o usuário. Só pode ser executado no servidor (a API Key do
 * SSO-MS nunca deve chegar ao browser).
 */
export async function login({ login, senha }: LoginPayload): Promise<Sessao> {
    const { data } = await ssoMsApi.post("/identidade-sso/api/v1/login/", {
        login,
        senha,
    });

    return {
        usuario: {
            nome: data.nome,
            email: data.email,
            cpf: data.cpf,
            rf: data.rf,
            roles: data.roles?.realm_access?.roles ?? [],
            realmAtivo: data.sessao?.sistemas?.[0]?.sistemaNome ?? "",
        },
        sessao: {
            sessaoId: data.sessao.sessao_id,
            login: data.sessao.login,
            sistemas: data.sessao.sistemas ?? [],
            expiraEm: data.sessao.expira_em,
        },
    };
}
