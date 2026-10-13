import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TableBodySistemas } from "./TableBodySistemas";

const contextMock = vi.hoisted(() => ({
    dataClientsListPaginated: [] as Array<Record<string, unknown>>,
    isLoadingDataClientsList: false,
    handleOpenConfirmDelete: vi.fn(),
    handleOpenModalDataForm: vi.fn(),
    handleRotateClientSecret: vi.fn(),
}));

vi.mock("../hooks/useSistemasContext", () => ({
    useSistemasContext: () => contextMock,
}));

vi.mock("@/components/TooltipCustom", () => ({
    TooltipCustom: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("TableBodySistemas", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        contextMock.dataClientsListPaginated = [];
        contextMock.isLoadingDataClientsList = false;
    });

    it("exibe um spinner durante o carregamento", () => {
        contextMock.isLoadingDataClientsList = true;

        render(<TableBodySistemas />);

        expect(screen.getByText("Por favor, aguarde...")).toBeInTheDocument();
    });

    it("renderiza um client ativo e dispara editar, rotação e exclusão", () => {
        const client = {
            id: "client-1",
            client_id: "portal",
            nome: "Portal",
            protocolo: "OPENID-CONNECT",
            habilitado: true,
        };
        contextMock.dataClientsListPaginated = [client];

        render(<TableBodySistemas />);

        expect(screen.getByText("portal")).toBeInTheDocument();
        expect(screen.getByText("ID: client-1")).toBeInTheDocument();
        expect(screen.getByText("Portal")).toBeInTheDocument();
        expect(screen.getByText("Ativo")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Editar" }));
        fireEvent.click(screen.getByRole("button", { name: "Credenciais" }));
        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

        expect(contextMock.handleOpenModalDataForm).toHaveBeenCalledWith(client);
        expect(contextMock.handleRotateClientSecret).toHaveBeenCalledWith("client-1", "portal");
        expect(contextMock.handleOpenConfirmDelete).toHaveBeenCalledWith(client);
    });

    it("desabilita exclusão de clients inativos", () => {
        contextMock.dataClientsListPaginated = [
            { id: "client-2", client_id: "legacy", nome: "Legacy", protocolo: "OIDC", habilitado: false },
        ];

        render(<TableBodySistemas />);

        expect(screen.getByText("Inativo")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Excluir" })).toBeDisabled();
    });
});
