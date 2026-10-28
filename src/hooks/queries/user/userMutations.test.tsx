import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useUserCreate } from "./useUserCreate";
import { useUserDelete } from "./useUserDelete";
import { useUserEmailPatch } from "./useUserEmailPatch";
import { useUserPatch } from "./useUserPatch";
import { createUser, deleteUser, updateUser, updateUserEmail } from "@/lib/user";
import { toast } from "@/lib/toast";

vi.mock("@/lib/toast", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

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
    });

    it("cria e invalida a lista após sucesso", async () => {
        vi.mocked(createUser).mockResolvedValue({ id: "u1" });
        const handleCloseModalDataForm = vi.fn();
        const { result } = renderHook(() => useUserCreate({ handleCloseModalDataForm }), { wrapper: wrapper() });

        result.current.mutationPost.mutate({
            usuario: "123", nome: "Ana", sobrenome: "Lima", email: "ana@example.com",
            cpf: "12345678901", rf: null, tipo_usuario: "servidor",
        });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));
        expect(createUser).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Novo Usuário", "Usuário criado com sucesso!");
    });

    it("notifica quando a criação de usuário falha", async () => {
        vi.mocked(createUser).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useUserCreate({ handleCloseModalDataForm: vi.fn() }), { wrapper: wrapper() });

        result.current.mutationPost.mutate({ usuario: "123", nome: "Ana", sobrenome: "Lima", email: "ana@example.com", cpf: "12345678901", rf: null, tipo_usuario: "servidor" });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));
        expect(toast.error).toHaveBeenCalledWith("Novo Usuário", "Erro ao criar usuário. Por favor, tente novamente.");
    });

    it("exclui usuário e trata erro", async () => {
        vi.mocked(deleteUser).mockRejectedValue(new Error("falha"));
        const handleCloseConfirmDelete = vi.fn();
        const { result } = renderHook(() => useUserDelete({ handleCloseConfirmDelete }), { wrapper: wrapper() });

        result.current.mutationDelete.mutate({ userId: "u1" });

        await waitFor(() => expect(result.current.mutationDelete.isError).toBe(true));
        expect(toast.error).toHaveBeenCalledWith("Desabilitar Usuário", "Ocorreu um erro inesperado ao desabilitar o usuário");
    });

    it("atualiza dados e fecha o formulário", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateUser).mockResolvedValue(null);
        const { result } = renderHook(() => useUserPatch({ handleCloseModalDataForm: handleClose }), { wrapper: wrapper() });

        result.current.mutationPatch.mutate({ userId: "u1", nome: "Ana" });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));
        expect(handleClose).toHaveBeenCalledOnce();
        expect(toast.success).toHaveBeenCalledWith("Atualizar Usuário", "Usuário atualizado com sucesso!");
    });

    it("notifica quando a atualização de usuário falha", async () => {
        vi.mocked(updateUser).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useUserPatch({ handleCloseModalDataForm: vi.fn() }), { wrapper: wrapper() });

        result.current.mutationPatch.mutate({ userId: "u1", nome: "Ana" });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));
        expect(toast.error).toHaveBeenCalledWith("Atualizar Usuário", "Ocorreu um erro inesperado ao atualizar o usuário");
    });

    it("atualiza email somente quando solicitado e trata erro", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateUserEmail).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useUserEmailPatch({ handleCloseModalDataForm: handleClose }), { wrapper: wrapper() });

        result.current.mutationEmailPatch.mutate({ userId: "u1", email: "ana@example.com", needInvalidateQuery: false });
        await waitFor(() => expect(result.current.mutationEmailPatch.isError).toBe(true));

        expect(handleClose).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Atualizar Email", "Ocorreu um erro inesperado ao atualizar o email");
    });
});
