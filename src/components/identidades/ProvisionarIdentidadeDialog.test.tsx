import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProvisionarIdentidadeDialog } from "@/components/identidades/ProvisionarIdentidadeDialog";

describe("ProvisionarIdentidadeDialog", () => {
    it("abre o modal ao clicar em Novo usuário e fecha ao cancelar", async () => {
        const user = userEvent.setup();
        render(<ProvisionarIdentidadeDialog />);

        await user.click(screen.getByRole("button", { name: /novo usuário/i }));
        expect(screen.getByText("Provisionar identidade")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /cancelar/i }));
        expect(screen.queryByText("Provisionar identidade")).not.toBeInTheDocument();
    });

    it("fecha o modal ao clicar em Provisionar", async () => {
        const user = userEvent.setup();
        render(<ProvisionarIdentidadeDialog />);

        await user.click(screen.getByRole("button", { name: /novo usuário/i }));
        await user.click(screen.getByRole("button", { name: /^provisionar$/i }));

        expect(screen.queryByText("Provisionar identidade")).not.toBeInTheDocument();
    });
});
