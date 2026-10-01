import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

vi.mock("next/navigation", () => ({
    usePathname: () => "/dashboard",
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

    it("exibe o realm ativo mockado no rodapé", () => {
        renderSidebar();

        expect(screen.getByText("sme-devops")).toBeInTheDocument();
    });
});
