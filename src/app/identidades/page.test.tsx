import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import IdentidadesPage from "@/app/identidades/page";

describe("IdentidadesPage", () => {
    it("renderiza título e identidades mockadas", () => {
        render(<IdentidadesPage />);

        expect(screen.getByText("Gestão de identidades")).toBeInTheDocument();
        expect(screen.getByText("123456789-12")).toBeInTheDocument();
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Rafael.risso")).toBeInTheDocument();
        expect(screen.getByText("helio.teste")).toBeInTheDocument();
    });
});
