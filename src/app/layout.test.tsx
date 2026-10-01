import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/components/layout/AppShell", () => ({
    AppShell: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="app-shell">{children}</div>
    ),
}));

describe("RootLayout", () => {
    it("envolve o conteúdo com AppShell dentro de html/body", async () => {
        const { default: RootLayout } = await import("@/app/layout");

        const html = renderToStaticMarkup(
            <RootLayout>
                <span>conteúdo</span>
            </RootLayout>
        );

        expect(html).toContain("<html");
        expect(html).toContain('lang="pt-BR"');
        expect(html).toContain("app-shell");
        expect(html).toContain("conteúdo");
    });
});
