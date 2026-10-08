import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import IdentidadesPage from "@/app/identidades/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("IdentidadesPage", () => {
    beforeEach(() => {
        contextMock.openModalDataForm = true;
        vi.clearAllMocks();
    });

    it("renderiza título e identidades mockadas", () => {
        render(
            <QueryClientProvider client={new QueryClient()}>
                <IdentidadesPage />
            </QueryClientProvider>
        );

        expect(screen.getByText("Gestão de identidades")).toBeInTheDocument();
        expect(screen.getByText("Visão geral dos realms, sistemas e usuários da plataforma de Identidade.")).toBeInTheDocument();
    });
});
