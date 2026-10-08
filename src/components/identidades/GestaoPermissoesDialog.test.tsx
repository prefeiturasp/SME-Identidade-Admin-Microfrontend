import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GestaoPermissoesDialog } from "@/components/identidades/GestaoPermissoesDialog";
import type { UserData } from "@/lib/user/types";

const identidade: UserData = {
    id: "1",
    username: "123456789-12",
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@example.com",
    enabled: true,
    emailVerified: true,
    cpf: "123456789-12",
    rf: "123456789012",
    tipo_usuario: "Externo",
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
                identidade={{
                    ...identidade,
                    firstName: "",
                    lastName: "",
                    username: "helio.teste",
                }}
            />
        );

        await user.click(screen.getByRole("button", { name: /permissões/i }));

        expect(screen.getByText("HE")).toBeInTheDocument();
    });
});
