import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

vi.mock("@/components/login/LoginForm", () => ({
    LoginForm: (props: Record<string, unknown>) => <pre data-testid="props">{JSON.stringify(props)}</pre>,
}));

describe("LoginPage", () => {
    afterEach(() => vi.unstubAllEnvs());

    it("repassa destino, aviso de expiração e caminho base ao formulário", () => {
        render(<LoginPage searchParams={{ next: "/sistemas", expirada: "1" }} />);

        expect(JSON.parse(screen.getByTestId("props").textContent ?? "{}")).toEqual({
            basePath: "/admin",
            destino: "/sistemas",
            sessaoExpirada: true,
        });
        expect(screen.getByTestId("login-imagem")).toHaveStyle({
            backgroundImage: "url(/admin/images/login-sala-de-aula.png)",
        });
    });

    it("repassa a URL de recuperação de senha quando configurada", () => {
        vi.stubEnv("URL_ESQUECI_SENHA", "https://exemplo/recuperar");
        render(<LoginPage searchParams={{}} />);

        expect(JSON.parse(screen.getByTestId("props").textContent ?? "{}")).toMatchObject({
            urlEsqueciSenha: "https://exemplo/recuperar",
            sessaoExpirada: false,
        });
    });
});
