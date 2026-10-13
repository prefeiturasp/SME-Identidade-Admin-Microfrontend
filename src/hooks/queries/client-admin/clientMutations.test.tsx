import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient, disableClient, getClients, rotateClientSecret, updateClient } from "@/lib/client";
import { useClientCreate } from "./useClientCreate";
import { useClientDelete } from "./useClientDelete";
import { useClientPatch } from "./useClientPatch";
import { useClientRotacionar } from "./useClientRotacionar";
import { QUERY_KEY_LIST_CLIENTS, useClientsList } from "./useClientsList";

vi.mock("@/lib/client", () => ({ createClient: vi.fn(), disableClient: vi.fn(), getClients: vi.fn(), rotateClientSecret: vi.fn(), updateClient: vi.fn() }));

function wrapper(client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("client mutation hooks", () => {
  beforeEach(() => { vi.clearAllMocks(); vi.spyOn(window, "alert").mockImplementation(() => {}); });
  afterEach(() => vi.restoreAllMocks());

  it("cria cliente e fecha formulário", async () => {
    vi.mocked(createClient).mockResolvedValue({} as never);
    const close = vi.fn();
    const { result } = renderHook(() => useClientCreate({ handleCloseModalDataForm: close }), { wrapper: wrapper() });
    result.current.mutationPost.mutate({ nome: "Portal" } as never);
    await waitFor(() => expect(result.current.mutationPost.isSuccess).toBe(true));
    expect(close).toHaveBeenCalledOnce();
  });

  it("desativa cliente e apresenta sucesso", async () => {
    vi.mocked(disableClient).mockResolvedValue(null);
    const close = vi.fn();
    const { result } = renderHook(() => useClientDelete({ handleCloseConfirmDelete: close }), { wrapper: wrapper() });
    result.current.mutationDelete.mutate({ id: "c1" });
    await waitFor(() => expect(result.current.mutationDelete.isSuccess).toBe(true));
    expect(window.alert).toHaveBeenCalledWith("Cliente desabilitado com sucesso");
    expect(close).toHaveBeenCalledOnce();
  });

  it("atualiza cliente e fecha formulário", async () => {
    vi.mocked(updateClient).mockResolvedValue(null);
    const close = vi.fn();
    const { result } = renderHook(() => useClientPatch({ handleCloseModalDataForm: close }), { wrapper: wrapper() });
    result.current.mutationPatch.mutate({ id: "c1", nome: "Portal" });
    await waitFor(() => expect(result.current.mutationPatch.isSuccess).toBe(true));
    expect(window.alert).toHaveBeenCalledWith("Cliente atualizado com sucesso");
    expect(close).toHaveBeenCalledOnce();
  });

  it("rotaciona segredo e atualiza o diálogo", async () => {
    vi.mocked(rotateClientSecret).mockResolvedValue({ id: "c1", secret: "segredo" });
    const open = vi.fn(); const detail = vi.fn();
    const { result } = renderHook(() => useClientRotacionar({ setOpenRotateDialog: open, setDetailRotatedSecret: detail }), { wrapper: wrapper() });
    result.current.mutationRotate.mutate({ id: "c1", clientId: "portal" });
    await waitFor(() => expect(result.current.mutationRotate.isSuccess).toBe(true));
    expect(open).toHaveBeenCalledWith(true);
    expect(detail).toHaveBeenCalledWith({ clientId: "portal", secret: "segredo" });
    expect(result.current.isLoadingClientRotate).toBe(false);
  });

  it("trata falha nas mutações", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("falha"));
    const { result } = renderHook(() => useClientCreate({ handleCloseModalDataForm: vi.fn() }), { wrapper: wrapper() });
    result.current.mutationPost.mutate({} as never);
    await waitFor(() => expect(result.current.mutationPost.isError).toBe(true));
    expect(window.alert).toHaveBeenCalledWith("Ocorreu um erro inesperado");
  });
});

describe("useClientsList", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("busca clientes e retorna os dados da lista", async () => {
    const clients = [{ id: "c1", nome: "Portal" }];
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.mocked(getClients).mockResolvedValue(clients as never);

    const { result } = renderHook(() => useClientsList(), { wrapper: wrapper(queryClient) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getClients).toHaveBeenCalledOnce();
    expect(result.current.data).toEqual(clients);
    expect(queryClient.getQueryCache().find({ queryKey: [QUERY_KEY_LIST_CLIENTS] })).toBeDefined();
  });

  it("expõe o erro quando a busca de clientes falha", async () => {
    const error = new Error("falha ao buscar clientes");
    vi.mocked(getClients).mockRejectedValue(error);

    const { result } = renderHook(() => useClientsList(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getClients).toHaveBeenCalledOnce();
    expect(result.current.error).toBe(error);
  });
});
