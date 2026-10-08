import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProvisionarIdentidadeDialog } from "@/components/identidades/ProvisionarIdentidadeDialog";

const contextMock = vi.hoisted(() => ({
    openModalDataForm: true,
    userDataForm: {
        nome: "João",
        sobrenome: "Silva",
        cpf: "12345678910",
        email: "joao.silva@example.com",
        tipo_usuario: "servidor",
        usuario: "",
        rf: null,
    },
    handleOpenModalDataForm: vi.fn(),
    handleCloseModalDataForm: vi.fn(),
    setUserDataForm: vi.fn(),
    handleSubmitUserForm: vi.fn((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }),
}));

vi.mock("@/app/identidades/hooks/useIdentidadeContext", () => ({
    useIdentidadeContext: () => contextMock,
}));

describe("ProvisionarIdentidadeDialog", () => {
    beforeEach(() => {
        contextMock.openModalDataForm = true;
        vi.clearAllMocks();
    });

    it("abre o modal ao clicar em Novo usuário", async () => {
        const user = userEvent.setup();
        contextMock.openModalDataForm = false;
        render(<ProvisionarIdentidadeDialog />);

        await user.click(screen.getByRole("button", { name: /novo usuário/i }));

        expect(contextMock.handleOpenModalDataForm).toHaveBeenCalledTimes(1);
    });

    it("fecha o modal ao clicar em Cancelar", async () => {
        const user = userEvent.setup();
        render(<ProvisionarIdentidadeDialog />);

        await user.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(contextMock.handleCloseModalDataForm).toHaveBeenCalledTimes(1);
    });

    it("envia o formulário ao clicar em Provisionar", async () => {
        const user = userEvent.setup();
        render(<ProvisionarIdentidadeDialog />);

        await user.click(screen.getByRole("button", { name: /^provisionar$/i }));

        expect(contextMock.handleSubmitUserForm).toHaveBeenCalledTimes(1);
    });
});
