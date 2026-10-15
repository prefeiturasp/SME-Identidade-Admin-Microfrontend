import { isAxiosError } from "axios";

import { ssoMsApi } from "@/lib/axios";
import type { ResultadoLogin, SituacaoSessao } from "@/types/auth";

const PREFIXO_SSO = "/identidade-sso/api/v1";
const ROLE_ACESSO_PADRAO = "identidade-admin";

export class CredenciaisInvalidasError extends Error { }

export class ServicoIndisponivelError extends Error { }

interface LoginPayload {
    login: string;
    senha: string;
}

function statusDoErro(erro: unknown): number | undefined {
    return isAxiosError(erro) ? erro.response?.status : undefined;
}

/**
 * Autentica no SSO-Microsservico. Só pode rodar no servidor, porque a
 * API Key do SSO-MS nunca deve chegar ao navegador.
 *
 * Sem sessão criada no SSO-MS o acesso não pode ser validado depois, por
 * isso esse caso é tratado como indisponibilidade e não como sucesso.
 */
export async function login({ login, senha }: LoginPayload): Promise<ResultadoLogin> {
    let data;
    try {
        ({ data } = await ssoMsApi.post(`${PREFIXO_SSO}/login/`, { login, senha }));
    } catch (erro) {
        if (statusDoErro(erro) === 401) {
            throw new CredenciaisInvalidasError("Login ou senha inválidos.");
        }
        throw new ServicoIndisponivelError("Serviço de autenticação indisponível.");
    }

    if (!data?.sessao?.sessao_id) {
        throw new ServicoIndisponivelError("Sessão não criada no serviço de autenticação.");
    }

    return {
        usuario: {
            nome: data.nome ?? "",
            login: data.sessao.login ?? login,
            email: data.email ?? "",
            rf: data.rf ?? "",
        },
        roles: data.roles?.realm_access?.roles ?? [],
        sessaoId: data.sessao.sessao_id,
        expiraEm: data.sessao.expira_em,
    };
}

/**
 * Renova a sessão no SSO-MS, o que também confirma que ela segue ativa.
 * 404 e 409 indicam sessão encerrada (logout global) ou expirada.
 */
export async function renovarSessao(sessaoId: string): Promise<SituacaoSessao> {
    try {
        await ssoMsApi.post(`${PREFIXO_SSO}/sessoes/${encodeURIComponent(sessaoId)}/renovar/`);
        return "valida";
    } catch (erro) {
        const status = statusDoErro(erro);
        if (status === 404 || status === 409) return "encerrada";
        throw new ServicoIndisponivelError("Serviço de autenticação indisponível.");
    }
}

/**
 * Dispara o logout global da sessão. Falhas não interrompem a saída do
 * usuário: o cookie local é removido de qualquer forma.
 */
export async function encerrarSessao(sessaoId: string): Promise<boolean> {
    try {
        await ssoMsApi.post(`${PREFIXO_SSO}/sessoes/${encodeURIComponent(sessaoId)}/logout/`);
        return true;
    } catch {
        return false;
    }
}

export function roleAcessoAdmin(): string {
    return process.env.ADMIN_ROLE_ACESSO || ROLE_ACESSO_PADRAO;
}

export function temAcessoAdmin(roles: string[]): boolean {
    return roles.includes(roleAcessoAdmin());
}
