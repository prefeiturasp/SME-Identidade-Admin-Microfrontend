import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmarExclusaoDialog } from "@/components/identidades/ConfirmarExclusaoDialog";

const contextMock = vi.hoisted(() => ({
    openConfirmDelete: true,
    handleCloseConfirmDelete: vi.fn(),
    handleDeleteUser: vi.fn(),
}));

vi.mock("@/app/identidades/hooks/useIdentidadeContext", () => ({
    useIdentidadeContext: () => contextMock,
}));

describe("ConfirmarExclusaoDialog", () => {
    beforeEach(() => {
        contextMock.openConfirmDelete = true;
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza a confirmação quando está aberto", () => {
        render(<ConfirmarExclusaoDialog />);

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Confirmar exclusão" })).toBeInTheDocument();
        expect(
            screen.getByText("Tem certeza que deseja excluir esta identidade?")
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    });

    it("não renderiza o conteúdo quando está fechado", () => {
        contextMock.openConfirmDelete = false;

        render(<ConfirmarExclusaoDialog />);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.queryByText("Confirmar exclusão")).not.toBeInTheDocument();
    });

    it("chama o fechamento ao cancelar", async () => {
        const user = userEvent.setup();
        render(<ConfirmarExclusaoDialog />);

        await user.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(contextMock.handleCloseConfirmDelete).toHaveBeenCalledTimes(1);
    });

    it("chama a exclusão ao confirmar", async () => {
        const user = userEvent.setup();
        render(<ConfirmarExclusaoDialog />);

        await user.click(screen.getByRole("button", { name: "Confirmar" }));

        expect(contextMock.handleDeleteUser).toHaveBeenCalledTimes(1);
    });

    it("chama o fechamento ao pressionar Escape", async () => {
        const user = userEvent.setup();
        render(<ConfirmarExclusaoDialog />);

        await user.keyboard("{Escape}");

        expect(contextMock.handleCloseConfirmDelete).toHaveBeenCalledTimes(1);
    });
});
