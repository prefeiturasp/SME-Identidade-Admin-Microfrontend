import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaginationIdentidade } from "./PaginationIdentidade";

const contextMock = vi.hoisted(() => ({
    dataUserList: { page: 2, count: 25 },
    isLoadingDataUserList: false,
    setPage: vi.fn(),
}));

vi.mock("../hooks/useIdentidadeContext", () => ({
    useIdentidadeContext: () => contextMock,
}));

describe("PaginationIdentidade", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        contextMock.isLoadingDataUserList = false;
    });

    it("não renderiza enquanto a lista está carregando", () => {
        contextMock.isLoadingDataUserList = true;

        const { container } = render(<PaginationIdentidade />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renderiza a página atual e permite trocar de página", async () => {
        const { userEvent } = await import("@testing-library/user-event");
        const user = userEvent.setup();

        render(<PaginationIdentidade />);

        expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
        await user.click(screen.getByRole("link", { name: "3" }));

        expect(contextMock.setPage).toHaveBeenCalledWith(3);
    });
});
