import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { adminMsApi, definirRealmAtivo } from "@/lib/axios-admin";
import { getRealms } from "@/lib/realm";
import { CHAVE_REALM_ATIVO, RealmAtivoProvider, useRealmAtivo } from "./RealmAtivoProvider";

vi.mock("@/lib/realm", () => ({
    getRealms: vi.fn(),
}));

function Consumidor() {
    const { realmAtivo, realmEfetivo, selecionarRealm, limparRealm } = useRealmAtivo();
    return (
        <>
            <span data-testid="realm">{realmAtivo ?? "nenhum"}</span>
            <span data-testid="efetivo">{realmEfetivo ?? "nenhum"}</span>
            <button onClick={() => selecionarRealm("COTIC")}>selecionar padrão</button>
            <button onClick={() => selecionarRealm("sme-apps")}>selecionar</button>
            <button onClick={() => limparRealm()}>limpar</button>
        </>
    );
}

function renderComProvider(queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
    return render(
        <QueryClientProvider client={queryClient}>
            <RealmAtivoProvider>
                <Consumidor />
            </RealmAtivoProvider>
        </QueryClientProvider>
    );
}

describe("RealmAtivoProvider", () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.mocked(getRealms).mockResolvedValue([
            { id: "r1", nome: "COTIC", nome_exibicao: null, habilitado: true, oficial: true, finalidade: null, padrao: true, protegido: true },
            { id: "r2", nome: "sme-apps", nome_exibicao: null, habilitado: true, oficial: true, finalidade: null, padrao: false, protegido: true },
        ]);
    });

    afterEach(() => {
        definirRealmAtivo(null);
        vi.restoreAllMocks();
    });

    it("começa sem realm explícito, tendo o padrão como efetivo", async () => {
        renderComProvider();

        expect(screen.getByTestId("realm")).toHaveTextContent("nenhum");
        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBeUndefined();
        await waitFor(() => expect(screen.getByTestId("efetivo")).toHaveTextContent("COTIC"));
    });

    it("selecionar o realm padrão equivale a limpar a seleção", async () => {
        const user = userEvent.setup();
        renderComProvider();
        await waitFor(() => expect(screen.getByTestId("efetivo")).toHaveTextContent("COTIC"));

        await user.click(screen.getByRole("button", { name: "selecionar" }));
        expect(screen.getByTestId("efetivo")).toHaveTextContent("sme-apps");

        await user.click(screen.getByRole("button", { name: "selecionar padrão" }));

        expect(screen.getByTestId("realm")).toHaveTextContent("nenhum");
        expect(screen.getByTestId("efetivo")).toHaveTextContent("COTIC");
        expect(window.localStorage.getItem(CHAVE_REALM_ATIVO)).toBeNull();
        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBeUndefined();
    });

    it("restaura o realm salvo e aplica o header", async () => {
        window.localStorage.setItem(CHAVE_REALM_ATIVO, "sme-devops");

        await act(async () => {
            renderComProvider();
        });

        expect(screen.getByTestId("realm")).toHaveTextContent("sme-devops");
        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBe("sme-devops");
    });

    it("seleciona realm, persiste e recarrega as consultas", async () => {
        const user = userEvent.setup();
        const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        const invalidate = vi.spyOn(queryClient, "invalidateQueries");
        renderComProvider(queryClient);

        await user.click(screen.getByRole("button", { name: "selecionar" }));

        expect(screen.getByTestId("realm")).toHaveTextContent("sme-apps");
        expect(window.localStorage.getItem(CHAVE_REALM_ATIVO)).toBe("sme-apps");
        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBe("sme-apps");
        expect(invalidate).toHaveBeenCalled();
    });

    it("limpa a seleção, remove o header e o valor salvo", async () => {
        const user = userEvent.setup();
        renderComProvider();

        await user.click(screen.getByRole("button", { name: "selecionar" }));
        await user.click(screen.getByRole("button", { name: "limpar" }));

        expect(screen.getByTestId("realm")).toHaveTextContent("nenhum");
        expect(window.localStorage.getItem(CHAVE_REALM_ATIVO)).toBeNull();
        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBeUndefined();
    });

    it("segue funcionando quando o armazenamento falha", async () => {
        const user = userEvent.setup();
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("bloqueado"); });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("bloqueado"); });
        renderComProvider();

        await user.click(screen.getByRole("button", { name: "selecionar" }));

        expect(screen.getByTestId("realm")).toHaveTextContent("sme-apps");
    });

    it("sem provider, expõe realm vazio e seleção sem efeito", () => {
        render(<Consumidor />);

        expect(screen.getByTestId("realm")).toHaveTextContent("nenhum");
        screen.getByRole("button", { name: "selecionar" }).click();
        screen.getByRole("button", { name: "limpar" }).click();
        screen.getByRole("button", { name: "selecionar padrão" }).click();
        expect(screen.getByTestId("realm")).toHaveTextContent("nenhum");
        expect(screen.getByTestId("efetivo")).toHaveTextContent("nenhum");
    });
});
