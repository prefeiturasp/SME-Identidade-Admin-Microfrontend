import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AppLayout from "./layout";

const mocks = vi.hoisted(() => ({
    cookie: undefined as string | undefined,
    lerSessao: vi.fn(),
    renovarSessao: vi.fn(),
    redirect: vi.fn((destino: string) => { throw new Error(`redirect:${destino}`); }),
}));

vi.mock("next/headers", () => ({
    cookies: () => ({ get: () => (mocks.cookie ? { value: mocks.cookie } : undefined) }),
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/auth", () => ({ renovarSessao: mocks.renovarSessao }));
vi.mock("@/lib/auth/sessao", () => ({ NOME_COOKIE_SESSAO: "admin_sessao", lerSessao: mocks.lerSessao }));
vi.mock("@/components/layout/AppShell", () => ({
    AppShell: ({ children }: { children: React.ReactNode }) => <div data-testid="app-shell">{children}</div>,
}));
vi.mock("@/providers/RealmAtivoProvider", () => ({
    RealmAtivoProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/providers/SessaoProvider", () => ({
    SessaoProvider: ({ usuario, children }: { usuario: { nome: string }, children: React.ReactNode }) => (
        <div data-usuario={usuario.nome}>{children}</div>
    ),
}));

describe("AppLayout (guard)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.cookie = "valor";
    });

    it("redireciona para o login sem sessão válida", async () => {
        mocks.lerSessao.mockReturnValueOnce(null);

        await expect(AppLayout({ children: null })).rejects.toThrow("redirect:/login");
        expect(mocks.renovarSessao).not.toHaveBeenCalled();
    });

    it("encerra localmente quando a sessão acabou no SSO-MS", async () => {
        mocks.lerSessao.mockReturnValueOnce({ sid: "s1", nome: "Ana", login: "1" });
        mocks.renovarSessao.mockResolvedValueOnce("encerrada");

        await expect(AppLayout({ children: null })).rejects.toThrow("redirect:/api/logout");
    });

    it("renderiza as telas com o usuário da sessão", async () => {
        mocks.lerSessao.mockReturnValueOnce({ sid: "s1", nome: "Ana", login: "1" });
        mocks.renovarSessao.mockResolvedValueOnce("valida");

        const html = renderToStaticMarkup(await AppLayout({ children: <span>conteúdo</span> }));

        expect(mocks.lerSessao).toHaveBeenCalledWith("valor");
        expect(html).toContain('data-usuario="Ana"');
        expect(html).toContain("app-shell");
        expect(html).toContain("conteúdo");
    });
});
