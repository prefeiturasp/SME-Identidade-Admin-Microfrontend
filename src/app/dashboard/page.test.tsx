import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DashboardPage from "@/app/dashboard/page";

describe("DashboardPage", () => {
    it("renderiza título, contadores e realms mockados", () => {
        render(<DashboardPage />);

        expect(screen.getByText("Painel de controle")).toBeInTheDocument();
        expect(screen.getByText("Realms ativos")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("sme-apps")).toBeInTheDocument();
        expect(screen.getAllByText("COTIC")).toHaveLength(2);
    });
});
