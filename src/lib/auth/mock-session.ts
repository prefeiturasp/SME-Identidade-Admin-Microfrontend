import type { Sessao } from "@/types/auth";

/**
 * Sessão fixa usada enquanto a tela de login real (BFF + SSO-MS) não está
 * conectada à UI. Permite navegar pelas telas mockadas das tasks 153465/153466.
 */
export const mockSession: Sessao = {
    usuario: {
        nome: "Usuário SME-Devops",
        email: "sme-devops@sme.prefeitura.sp.gov.br",
        cpf: "",
        rf: "",
        roles: ["admin"],
        realmAtivo: "sme-devops",
    },
    sessao: {
        sessaoId: "mock-session-id",
        login: "sme-devops",
        sistemas: [{ sistemaId: "admin-mfe", sistemaNome: "sme-devops" }],
        expiraEm: "",
    },
};
