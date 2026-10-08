import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SistemasPage from "@/app/sistemas/page";

describe("SistemasPage", () => {
    it("renderiza título e clients mockados", () => {
        render(<SistemasPage />);

        expect(screen.getByText("Administração de sistemas")).toBeInTheDocument();
        expect(screen.getByText("account")).toBeInTheDocument();
        expect(screen.getByText("realm-management")).toBeInTheDocument();
        expect(screen.getAllByText("Ativo")).toHaveLength(6);
    });
});
