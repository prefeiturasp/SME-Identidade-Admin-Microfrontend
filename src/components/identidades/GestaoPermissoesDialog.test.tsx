import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GestaoPermissoesDialog } from "@/components/identidades/GestaoPermissoesDialog";
import type { IdentidadeMock } from "@/mocks/identidades";

const identidade: IdentidadeMock = {
    identidade: "123456789-12",
    nome: "João Silva",
    tipo: "Externo",
    idSme: "N/A",
    estado: "Padrão",
};

describe("GestaoPermissoesDialog", () => {
    it("abre o modal com os dados da identidade e fecha ao clicar em Fechar gestão", async () => {
        const user = userEvent.setup();
        render(<GestaoPermissoesDialog identidade={identidade} />);

        await user.click(screen.getByRole("button", { name: /permissões/i }));

        expect(screen.getByText("123456789-12")).toBeInTheDocument();
        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Grupos ativos")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /fechar gestão/i }));
        expect(screen.queryByText("Grupos ativos")).not.toBeInTheDocument();
    });

    it("usa as iniciais da identidade quando não há nome", async () => {
        const user = userEvent.setup();
        render(
            <GestaoPermissoesDialog
                identidade={{ ...identidade, nome: "", identidade: "helio.teste" }}
            />
        );

        await user.click(screen.getByRole("button", { name: /permissões/i }));

        expect(screen.getByText("HE")).toBeInTheDocument();
    });
});
