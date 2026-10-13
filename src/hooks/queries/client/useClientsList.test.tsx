import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { useClientsList } from "./useClientsList";
import { getClients } from "@/lib/client";

vi.mock("@/lib/client", () => ({
    getClients: vi.fn(),
}));

function wrapper() {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    function QueryClientWrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    }
    return QueryClientWrapper;
}

describe("useClientsList", () => {
    it("lista clients", async () => {
        const clients = [{ id: "c1", client_id: "sme-identidade-admin" }];
        vi.mocked(getClients).mockResolvedValue(clients as never);
        const { result } = renderHook(() => useClientsList(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(clients);
    });
});
