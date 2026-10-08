import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BlueprintsProvisionamento } from "@/components/blueprints/BlueprintsProvisionamento";

describe("BlueprintsProvisionamento", () => {
    it("inicia com a primeira ferramenta selecionada", () => {
        render(<BlueprintsProvisionamento realm="sme-devops" />);

        expect(screen.getByText("REALM:")).toBeInTheDocument();
        expect(screen.getAllByText("sme-devops").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Jenkins CI/CD").length).toBeGreaterThan(0);
    });

    it("troca a ferramenta selecionada ao clicar em outro card", async () => {
        const user = userEvent.setup();
        render(<BlueprintsProvisionamento realm="sme-devops" />);

        await user.click(screen.getByRole("button", { name: /rocket\.chat/i }));

        expect(screen.getByText("Ferramenta selecionada:")).toBeInTheDocument();
        expect(screen.getAllByText("Rocket.Chat").length).toBeGreaterThan(0);
    });
});
