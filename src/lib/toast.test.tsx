import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const toastMethods = vi.hoisted(() => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
}));

vi.mock("react-toastify", () => ({ toast: toastMethods }));

import { toast } from "./toast";

describe("toast", () => {
    beforeEach(() => vi.clearAllMocks());

    it("usa success como padrão e renderiza título e mensagem", () => {
        toast("Criação de Usuário", "Usuário criado com sucesso!");

        expect(toastMethods.success).toHaveBeenCalledOnce();
        const [content, options] = toastMethods.success.mock.calls[0];
        expect(renderToStaticMarkup(content)).toContain(
            "<strong>Criação de Usuário</strong><div>Usuário criado com sucesso!</div>",
        );
        expect(options).toBeUndefined();
        expect(toastMethods.error).not.toHaveBeenCalled();
        expect(toastMethods.info).not.toHaveBeenCalled();
        expect(toastMethods.warning).not.toHaveBeenCalled();
    });

    it.each([
        ["success", "success"],
        ["error", "error"],
        ["info", "info"],
        ["warning", "warning"],
    ] as const)("encaminha toast.%s para react-toastify e passa as opções", (variant, method) => {
        const options = { autoClose: 2500 };
        toast[variant]("Aviso", "Detalhe", options);

        expect(toastMethods[method]).toHaveBeenCalledOnce();
        expect(toastMethods[method].mock.calls[0][1]).toBe(options);
        expect(renderToStaticMarkup(toastMethods[method].mock.calls[0][0])).toContain("<div>Detalhe</div>");
    });

    it("renderiza apenas o título quando não há mensagem", () => {
        toast.warning("Atenção");

        expect(renderToStaticMarkup(toastMethods.warning.mock.calls[0][0])).toBe(
            '<div class="flex flex-col gap-1"><strong>Atenção</strong></div>',
        );
    });
});
