import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BlueprintsPage from "@/app/blueprints/page";

describe("BlueprintsPage", () => {
    it("renderiza título e ferramentas mockadas", () => {
        render(<BlueprintsPage />);

        expect(screen.getByText("Automação de blueprints")).toBeInTheDocument();
        expect(screen.getAllByText("Jenkins CI/CD").length).toBeGreaterThan(0);
        expect(screen.getByText("Rocket.Chat")).toBeInTheDocument();
        expect(screen.getByText("Iniciar provisionamento")).toBeInTheDocument();
    });
});
