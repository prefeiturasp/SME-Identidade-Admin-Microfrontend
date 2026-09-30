import { describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn();

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

describe("RootPage", () => {
    it("redireciona para /dashboard", async () => {
        const { default: RootPage } = await import("@/app/page");

        RootPage();

        expect(redirectMock).toHaveBeenCalledWith("/dashboard");
    });
});
