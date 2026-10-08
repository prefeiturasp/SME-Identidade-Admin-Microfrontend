import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CustomPagination } from "./CustomPagination";

describe("CustomPagination", () => {
    it("não renderiza quando existe apenas uma página", () => {
        const { container } = render(
            <CustomPagination rowsPerPage={10} actualPage={1} totalItems={10} onChange={vi.fn()} />,
        );

        expect(container.firstChild).toBeNull();
    });

    it("navega para páginas válidas e ignora limites inválidos", () => {
        const onChange = vi.fn();
        render(
            <CustomPagination rowsPerPage={10} actualPage={2} totalItems={50} onChange={onChange} />,
        );

        fireEvent.click(screen.getByRole("link", { name: "1" }));
        fireEvent.click(screen.getByRole("link", { name: "3" }));
        fireEvent.click(screen.getByRole("link", { name: "Go to next page" }));
        fireEvent.click(screen.getByRole("link", { name: "Go to previous page" }));

        expect(onChange.mock.calls.map(([page]) => page)).toEqual([1, 3, 3, 1]);
    });

    it("exibe reticências para listas longas e permite ir à última página", () => {
        const onChange = vi.fn();
        render(
            <CustomPagination rowsPerPage={10} actualPage={500} totalItems={10000} onChange={onChange} />,
        );

        expect(screen.getAllByText("More pages")).toHaveLength(2);
        expect(screen.getByRole("link", { name: "1000" })).toHaveClass("w-fit", "p-1");

        fireEvent.click(screen.getByRole("link", { name: "1000" }));
        fireEvent.click(screen.getByRole("link", { name: "Go to next page" }));

        expect(onChange).toHaveBeenNthCalledWith(1, 1000);
        expect(onChange).toHaveBeenNthCalledWith(2, 501);
    });
});
