import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SessaoProvider, useSessao } from "./SessaoProvider";

const navegacao = vi.hoisted(() => ({
    pathname: "/dashboard",
    router: { replace: vi.fn(), refresh: vi.fn() },
}));

vi.mock("next/navigation", () => ({
    usePathname: () => navegacao.pathname,
    useRouter: () => navegacao.router,
}));

function Consumidor() {
    const { usuario, sair } = useSessao();
    return (
        <>
            <span data-testid="usuario">{usuario?.nome ?? "ninguém"}</span>
            <button onClick={sair}>sair</button>
        </>
    );
}

function renderizar() {
    return render(
        <SessaoProvider usuario={{ nome: "Ana", login: "1234567" }} basePath="/admin">
            <Consumidor />
        </SessaoProvider>
    );
}

describe("SessaoProvider", () => {
    const fetchMock = vi.fn();
    const assign = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        navegacao.pathname = "/dashboard";
        fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
        vi.stubGlobal("fetch", fetchMock);
        vi.stubGlobal("location", { assign });
    });
    afterEach(() => vi.unstubAllGlobals());

    it("expõe o usuário e não consulta a sessão na primeira renderização", () => {
        renderizar();

        expect(screen.getByTestId("usuario")).toHaveTextContent("Ana");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("confere a sessão a cada troca de tela e sai quando ela foi encerrada", async () => {
        const { rerender } = renderizar();
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

        navegacao.pathname = "/sistemas";
        rerender(
            <SessaoProvider usuario={{ nome: "Ana", login: "1234567" }} basePath="/admin">
                <Consumidor />
            </SessaoProvider>
        );

        expect(fetchMock).toHaveBeenCalledWith("/admin/api/sessao", { cache: "no-store" });
        await waitFor(() => expect(assign).toHaveBeenCalledWith("/admin/api/logout"));
    });

    it("mantém o usuário na tela quando a sessão segue válida", async () => {
        const { rerender } = renderizar();

        navegacao.pathname = "/identidades";
        await act(async () => {
            rerender(
                <SessaoProvider usuario={{ nome: "Ana", login: "1234567" }} basePath="/admin">
                    <Consumidor />
                </SessaoProvider>
            );
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(assign).not.toHaveBeenCalled();
    });

    it("sai chamando o logout e voltando ao login", async () => {
        const user = userEvent.setup();
        renderizar();

        await user.click(screen.getByRole("button", { name: "sair" }));

        expect(fetchMock).toHaveBeenCalledWith("/admin/api/logout", { method: "POST" });
        expect(navegacao.router.replace).toHaveBeenCalledWith("/login");
        expect(navegacao.router.refresh).toHaveBeenCalled();
    });

    it("sem provider, não há usuário", () => {
        render(<Consumidor />);

        expect(screen.getByTestId("usuario")).toHaveTextContent("ninguém");
    });
});
