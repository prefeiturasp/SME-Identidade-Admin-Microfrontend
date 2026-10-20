import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

describe("RootLayout", () => {
    it("renderiza html/body com o conteúdo, sem o shell das telas protegidas", async () => {
        const { default: RootLayout } = await import("@/app/layout");

        const html = renderToStaticMarkup(
            <RootLayout>
                <span>conteúdo</span>
            </RootLayout>
        );

        expect(html).toContain("<html");
        expect(html).toContain('lang="pt-BR"');
        expect(html).not.toContain("SME Identidade</span>");
        expect(html).toContain("conteúdo");
    });
});
