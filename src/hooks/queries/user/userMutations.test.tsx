import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserCreate } from "./useUserCreate";
import { useUserDelete } from "./useUserDelete";
import { useUserEmailPatch } from "./useUserEmailPatch";
import { useUserPatch } from "./useUserPatch";
import { createUser, deleteUser, updateUser, updateUserEmail } from "@/lib/user";

vi.mock("@/lib/user", () => ({
    createUser: vi.fn(),
    deleteUser: vi.fn(),
    updateUser: vi.fn(),
    updateUserEmail: vi.fn(),
}));

function wrapper() {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    function QueryClientWrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    }
    return QueryClientWrapper;
}

describe("user mutation hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, "alert").mockImplementation(() => { });
    });

    it("cria e invalida a lista após sucesso", async () => {
        vi.mocked(createUser).mockResolvedValue({ id: "u1" });
        const { result } = renderHook(() => useUserCreate(), { wrapper: wrapper() });

        result.current.mutationPost.mutate({
            usuario: "123", nome: "Ana", sobrenome: "Lima", email: "ana@example.com",
            cpf: "12345678901", rf: null, tipo_usuario: "servidor",
        });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));
        expect(createUser).toHaveBeenCalled();
    });

    it("exclui usuário e trata erro", async () => {
        vi.mocked(deleteUser).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useUserDelete(), { wrapper: wrapper() });

        result.current.mutationDelete.mutate({ userId: "u1" });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));
        expect(window.alert).toHaveBeenCalledWith("Ocorreu um erro inesperado");
    });

    it("atualiza dados e fecha o formulário", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateUser).mockResolvedValue(null);
        const { result } = renderHook(() => useUserPatch({ handleCloseModalDataForm: handleClose }), { wrapper: wrapper() });

        result.current.mutationPatch.mutate({ userId: "u1", nome: "Ana" });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));
        expect(handleClose).toHaveBeenCalledOnce();
    });

    it("atualiza email somente quando solicitado e trata erro", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateUserEmail).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useUserEmailPatch({ handleCloseModalDataForm: handleClose }), { wrapper: wrapper() });

        result.current.mutationEmailPatch.mutate({ userId: "u1", email: "ana@example.com", needInvalidateQuery: false });
        await waitFor(() => expect(result.current.mutationEmailPatch.isError).toBe(true));

        expect(handleClose).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith("Ocorreu um erro inesperado");
    });
});
