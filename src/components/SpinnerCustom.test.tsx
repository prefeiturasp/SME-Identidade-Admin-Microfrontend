import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SpinnerCustom } from "./SpinnerCustom";

describe("SpinnerCustom", () => {
    it("exibe o título padrão e o indicador de carregamento", () => {
        render(<SpinnerCustom />);

        expect(screen.getByText("Por favor, aguarde...")).toBeInTheDocument();
        expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    });

    it("exibe o título informado e mantém o indicador", () => {
        render(<SpinnerCustom title="Carregando sistemas" />);

        expect(screen.getByText("Carregando sistemas")).toBeInTheDocument();
        expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    });
});
