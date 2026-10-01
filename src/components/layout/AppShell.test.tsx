import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/layout/AppShell";

vi.mock("next/navigation", () => ({
    usePathname: () => "/dashboard",
}));

describe("AppShell", () => {
    it("renderiza a sidebar e o conteúdo filho", () => {
        render(
            <AppShell>
                <p>conteúdo da página</p>
            </AppShell>
        );

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("conteúdo da página")).toBeInTheDocument();
    });
});
