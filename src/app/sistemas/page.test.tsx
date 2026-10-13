import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";

import SistemasPage from "@/app/sistemas/page";

const clients = vi.hoisted(() => [
    {
        id: "client-account",
        client_id: "account",
        nome: "Account",
        habilitado: true,
        client_publico: false,
        protocolo: "openid-connect",
        redirect_uris: [],
        web_origins: [],
        atributos: {},
    },
    {
        id: "client-realm-management",
        client_id: "realm-management",
        nome: "Realm Management",
        habilitado: true,
        client_publico: false,
        protocolo: "openid-connect",
        redirect_uris: [],
        web_origins: [],
        atributos: {},
    },
]);

vi.mock("@/hooks/queries/client-admin/useClientsList", () => ({
    useClientsList: () => ({
        data: clients,
        isFetching: false,
        refetch: vi.fn(),
    }),
}));

describe("SistemasPage", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });
    });

    it("renderiza título e clients mockados", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <SistemasPage />
                </TooltipProvider>
            </QueryClientProvider>
        );

        expect(screen.getByText("Administração de sistemas")).toBeInTheDocument();
        expect(screen.getByText("account")).toBeInTheDocument();
        expect(screen.getByText("realm-management")).toBeInTheDocument();
        expect(screen.getAllByText("Ativo")).toHaveLength(clients.length);
    });
});
