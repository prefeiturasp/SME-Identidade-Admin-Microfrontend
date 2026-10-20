import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "./LoginForm";

const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

function respostaFetch(status: number, corpo: unknown) {
    return Promise.resolve(new Response(JSON.stringify(corpo), { status }));
}

async function preencherEEnviar(senha = "segredo") {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Usuário"), " 1234567 ");
    await user.type(screen.getByLabelText("Senha"), senha);
    await user.click(screen.getByRole("button", { name: "Entrar" }));
    return user;
}

describe("LoginForm", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal("fetch", fetchMock);
    });
    afterEach(() => vi.unstubAllGlobals());

    it("só habilita o envio com login e senha preenchidos", async () => {
        const user = userEvent.setup();
        render(<LoginForm basePath="/admin" />);

        const entrar = screen.getByRole("button", { name: "Entrar" });
        expect(entrar).toBeDisabled();

        await user.type(screen.getByLabelText("Usuário"), "1234567");
        expect(entrar).toBeDisabled();

        await user.type(screen.getByLabelText("Senha"), "x");
        expect(entrar).toBeEnabled();
    });

    it("envia ao BFF e segue para o destino interno informado", async () => {
        fetchMock.mockReturnValueOnce(respostaFetch(200, { usuario: { nome: "Ana", login: "1234567" } }));
        render(<LoginForm basePath="/admin" destino="/sistemas" />);

        await preencherEEnviar();

        expect(fetchMock).toHaveBeenCalledWith("/admin/api/login", expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ login: "1234567", senha: "segredo" }),
        }));
        await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/sistemas"));
        expect(router.refresh).toHaveBeenCalled();
    });

    it("ignora destino externo e usa o dashboard", async () => {
        fetchMock.mockReturnValueOnce(respostaFetch(200, {}));
        render(<LoginForm basePath="/admin" destino="//malicioso.com" />);

        await preencherEEnviar();

        await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/dashboard"));
    });

    it("mostra a mensagem do servidor e limpa a senha em caso de recusa", async () => {
        fetchMock.mockReturnValueOnce(respostaFetch(403, { message: "Você não tem acesso ao Admin de Identidade." }));
        render(<LoginForm basePath="/admin" />);

        await preencherEEnviar();

        expect(await screen.findByRole("alert")).toHaveTextContent("Você não tem acesso ao Admin de Identidade.");
        expect(screen.getByLabelText("Senha")).toHaveValue("");
        expect(router.replace).not.toHaveBeenCalled();
    });

    it("usa mensagem genérica quando a resposta não tem corpo", async () => {
        fetchMock.mockReturnValueOnce(Promise.resolve(new Response("erro", { status: 500 })));
        render(<LoginForm basePath="/admin" />);

        await preencherEEnviar();

        expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível entrar. Tente novamente.");
    });

    it("informa indisponibilidade quando a requisição falha", async () => {
        fetchMock.mockRejectedValueOnce(new Error("rede"));
        render(<LoginForm basePath="/admin" />);

        await preencherEEnviar();

        expect(await screen.findByRole("alert")).toHaveTextContent("Serviço de autenticação indisponível.");
    });

    it("avisa quando a sessão expirou e permite ver a senha", async () => {
        const user = userEvent.setup();
        render(<LoginForm basePath="/admin" sessaoExpirada />);

        expect(screen.getByRole("status")).toHaveTextContent("Sua sessão expirou. Entre novamente.");

        await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
        expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "text");
        await user.click(screen.getByRole("button", { name: "Ocultar senha" }));
        expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
    });

    it("mostra a identidade visual e o link de recuperação quando configurado", () => {
        render(<LoginForm basePath="/admin" urlEsqueciSenha="https://exemplo/recuperar" />);

        expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
        expect(screen.getByAltText("Prefeitura de São Paulo").getAttribute("src")).toContain("logoprefeitura.png");
        expect(screen.getByRole("link", { name: "Esqueci minha senha" })).toHaveAttribute("href", "https://exemplo/recuperar");
    });

    it("não mostra o link de recuperação sem URL configurada", () => {
        render(<LoginForm basePath="/admin" />);

        expect(screen.queryByRole("link", { name: "Esqueci minha senha" })).not.toBeInTheDocument();
    });
});
