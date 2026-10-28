import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TableBodyIdentidade } from "./TableBodyIdentidade";

const contextMock = vi.hoisted(() => ({
    dataUserList: undefined as
        | {
            results: Array<Record<string, unknown>>;
        }
        | undefined,
    isLoadingDataUserList: false,
    handleOpenModalDataForm: vi.fn(),
    handleOpenConfirmDelete: vi.fn(),
}));

vi.mock("../hooks/useIdentidadeContext", () => ({
    useIdentidadeContext: () => contextMock,
}));

vi.mock("@/components/identidades/GestaoPermissoesDialog", () => ({
    GestaoPermissoesDialog: () => <button aria-label="Permissões">Permissões</button>,
}));

vi.mock("@/components/TooltipCustom", () => ({
    TooltipCustom: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("TableBodyIdentidade", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        contextMock.dataUserList = undefined;
        contextMock.isLoadingDataUserList = false;
    });

    it("exibe um spinner durante o carregamento", () => {
        contextMock.isLoadingDataUserList = true;

        render(<TableBodyIdentidade />);

        expect(screen.getByText("Por favor, aguarde...")).toBeInTheDocument();
    });

    it("renderiza usuários, valores padrão e executa as ações da linha", () => {
        const identidade = {
            id: "user-1",
            username: "maria",
            firstName: "Maria",
            lastName: "Silva",
            cpf: "123",
            email: "maria@example.com",
            tipo_usuario: undefined,
            rf: undefined,
            enabled: true,
        };
        contextMock.dataUserList = { results: [identidade] };

        render(<TableBodyIdentidade />);

        expect(screen.getByText("maria")).toBeInTheDocument();
        expect(screen.getByText("Maria Silva")).toBeInTheDocument();
        expect(screen.getAllByText("N/A")).toHaveLength(2);
        expect(screen.getByText("Ativo")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Editar" }));
        expect(contextMock.handleOpenModalDataForm).toHaveBeenCalledWith({
            nome: "Maria",
            sobrenome: "Silva",
            cpf: "123",
            email: "maria@example.com",
            tipo_usuario: undefined,
            usuario: "maria",
            rf: undefined,
            id: "user-1",
            enabled: true,
        });

        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
        expect(contextMock.handleOpenConfirmDelete).toHaveBeenCalledWith(
            expect.objectContaining({ id: "user-1", usuario: "maria" }),
        );
    });

    it("desabilita a exclusão de usuários inativos", () => {
        contextMock.dataUserList = {
            results: [{ id: "user-2", username: "joao", enabled: false }],
        };

        render(<TableBodyIdentidade />);

        expect(screen.getByText("Inativo")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Excluir" })).toBeDisabled();
    });
});
