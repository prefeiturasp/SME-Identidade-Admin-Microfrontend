import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessaoProvider } from "@/providers/SessaoProvider";

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
    usePathname: () => "/dashboard",
    useRouter: () => router,
}));

function renderSidebar() {
    return render(
        <SidebarProvider>
            <AppSidebar />
        </SidebarProvider>
    );
}

describe("AppSidebar", () => {
    it("renderiza todos os itens de menu", () => {
        renderSidebar();

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Identidades")).toBeInTheDocument();
    });

    it("destaca o item ativo com base na rota atual", () => {
        renderSidebar();

        const dashboardLink = screen.getByText("Dashboard").closest("[data-sidebar='menu-button']");
        expect(dashboardLink).toHaveAttribute("data-active", "true");
    });

    it("exibe o realm padrão no rodapé quando nenhum foi selecionado", () => {
        renderSidebar();

        expect(screen.getByText("Padrão")).toBeInTheDocument();
    });

    it("sem sessão, não exibe usuário nem botão de sair", () => {
        renderSidebar();

        expect(screen.queryByRole("button", { name: "Sair" })).not.toBeInTheDocument();
    });

    it("exibe o usuário logado e sai pelo botão", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
        vi.stubGlobal("fetch", fetchMock);
        render(
            <SessaoProvider usuario={{ nome: "Ana Lima", login: "1234567" }} basePath="/admin">
                <SidebarProvider>
                    <AppSidebar />
                </SidebarProvider>
            </SessaoProvider>
        );

        expect(screen.getByText("Ana Lima")).toBeInTheDocument();
        expect(screen.getByText("1234567")).toBeInTheDocument();

        await userEvent.setup().click(screen.getByRole("button", { name: "Sair" }));

        expect(fetchMock).toHaveBeenCalledWith("/admin/api/logout", { method: "POST" });
        expect(router.replace).toHaveBeenCalledWith("/login");
        vi.unstubAllGlobals();
    });
});
