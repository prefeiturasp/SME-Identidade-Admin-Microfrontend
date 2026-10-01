import { describe, expect, it, vi } from "vitest";

const postMock = vi.fn();

vi.mock("@/lib/axios", () => ({
    ssoMsApi: { post: (...args: unknown[]) => postMock(...args) },
}));

describe("login", () => {
    it("chama o SSO-MS e mapeia a resposta para o formato de Sessao", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                nome: "João Silva",
                email: "joao@sme.prefeitura.sp.gov.br",
                cpf: "12345678900",
                rf: "1234567",
                roles: { realm_access: { roles: ["admin"] } },
                sessao: {
                    sessao_id: "sessao-uuid",
                    login: "joao.silva",
                    sistemas: [{ sistemaId: "admin-mfe", sistemaNome: "sme-devops" }],
                    expira_em: "2026-01-01T00:00:00Z",
                },
            },
        });

        const { login } = await import("@/lib/auth");
        const sessao = await login({ login: "joao.silva", senha: "123" });

        expect(postMock).toHaveBeenCalledWith("/identidade-sso/api/v1/login/", {
            login: "joao.silva",
            senha: "123",
        });
        expect(sessao.usuario.nome).toBe("João Silva");
        expect(sessao.usuario.roles).toEqual(["admin"]);
        expect(sessao.usuario.realmAtivo).toBe("sme-devops");
        expect(sessao.sessao.sessaoId).toBe("sessao-uuid");
    });

    it("usa valores padrão quando roles e sistemas não vêm na resposta", async () => {
        postMock.mockResolvedValueOnce({
            data: {
                nome: "Sem Roles",
                email: "semroles@sme.prefeitura.sp.gov.br",
                cpf: "",
                rf: "",
                sessao: {
                    sessao_id: "sessao-uuid-2",
                    login: "sem.roles",
                    expira_em: "2026-01-01T00:00:00Z",
                },
            },
        });

        const { login } = await import("@/lib/auth");
        const sessao = await login({ login: "sem.roles", senha: "123" });

        expect(sessao.usuario.roles).toEqual([]);
        expect(sessao.usuario.realmAtivo).toBe("");
        expect(sessao.sessao.sistemas).toEqual([]);
    });
});
