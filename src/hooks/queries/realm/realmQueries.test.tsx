import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRealmCreate } from "./useRealmCreate";
import { useRealmPatch } from "./useRealmPatch";
import { useRealmFinalidades } from "./useRealmFinalidades";
import { QUERY_KEY_LIST_REALMS, useRealmsList } from "./useRealmsList";
import { createRealm, getFinalidades, getRealms, updateRealm } from "@/lib/realm";

vi.mock("@/lib/realm", () => ({
    createRealm: vi.fn(),
    getFinalidades: vi.fn(),
    getRealms: vi.fn(),
    updateRealm: vi.fn(),
}));

function criarQueryClient() {
    return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
}

function wrapper(queryClient = criarQueryClient()) {
    function QueryClientWrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    }
    return QueryClientWrapper;
}

const realm = { id: "r1", nome: "sme-apps", nome_exibicao: "SME Apps", habilitado: true, oficial: true, finalidade: null, padrao: false, protegido: true };

describe("realm query hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, "alert").mockImplementation(() => { });
    });

    it("lista realms", async () => {
        vi.mocked(getRealms).mockResolvedValue([realm]);
        const { result } = renderHook(() => useRealmsList(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([realm]);
    });

    it("lista finalidades de teste", async () => {
        vi.mocked(getFinalidades).mockResolvedValue({ finalidades: ["Sandbox", "UX"], padrao: "Produção" });
        const { result } = renderHook(() => useRealmFinalidades(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual({ finalidades: ["Sandbox", "UX"], padrao: "Produção" });
    });

    it("cria, invalida a lista e fecha o formulário", async () => {
        const queryClient = criarQueryClient();
        const invalidate = vi.spyOn(queryClient, "invalidateQueries");
        const handleClose = vi.fn();
        vi.mocked(createRealm).mockResolvedValue({ mensagem: "ok" });
        const { result } = renderHook(() => useRealmCreate({ handleCloseModal: handleClose }), { wrapper: wrapper(queryClient) });

        result.current.mutationPost.mutate({ nome: "sme-apps", nome_exibicao: "SME Apps" });

        await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));
        expect(createRealm).toHaveBeenCalledWith({ nome: "sme-apps", nome_exibicao: "SME Apps" });
        expect(invalidate).toHaveBeenCalledWith({ queryKey: [QUERY_KEY_LIST_REALMS] });
        expect(handleClose).toHaveBeenCalledOnce();
    });

    it("exibe a mensagem do backend quando a criação falha", async () => {
        const handleClose = vi.fn();
        vi.mocked(createRealm).mockRejectedValue(new AxiosError("falha", "ERR_BAD_REQUEST", undefined, undefined, {
            data: { codigo: "recurso_ja_existe", mensagem: "Recurso já existe." },
            status: 400,
            statusText: "Bad Request",
            headers: {},
            config: { headers: new AxiosHeaders() },
        }));
        const { result } = renderHook(() => useRealmCreate({ handleCloseModal: handleClose }), { wrapper: wrapper() });

        result.current.mutationPost.mutate({ nome: "sme-apps" });

        await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));
        expect(window.alert).toHaveBeenCalledWith("Recurso já existe.");
        expect(handleClose).not.toHaveBeenCalled();
    });

    it("atualiza pelo nome original e fecha o formulário", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateRealm).mockResolvedValue({ mensagem: "ok" });
        const { result } = renderHook(() => useRealmPatch({ handleCloseModal: handleClose }), { wrapper: wrapper() });

        result.current.mutationPatch.mutate({ nome: "sme-apps", habilitado: false });

        await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));
        expect(updateRealm).toHaveBeenCalledWith("sme-apps", { habilitado: false });
        expect(handleClose).toHaveBeenCalledOnce();
    });

    it("trata erro na atualização", async () => {
        const handleClose = vi.fn();
        vi.mocked(updateRealm).mockRejectedValue(new Error("falha"));
        const { result } = renderHook(() => useRealmPatch({ handleCloseModal: handleClose }), { wrapper: wrapper() });

        result.current.mutationPatch.mutate({ nome: "sme-apps", nome_exibicao: "Nova" });

        await waitFor(() => expect(result.current.mutationPatch.isError).toBe(true));
        expect(window.alert).toHaveBeenCalledWith("Ocorreu um erro inesperado");
        expect(handleClose).not.toHaveBeenCalled();
    });
});
