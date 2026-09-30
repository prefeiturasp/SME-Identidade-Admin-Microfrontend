import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "@/hooks/use-mobile";

function mockMatchMedia() {
    const listeners: (() => void)[] = [];

    globalThis.matchMedia = vi.fn().mockReturnValue({
        matches: false,
        media: "",
        addEventListener: (_event: string, cb: () => void) => listeners.push(cb),
        removeEventListener: vi.fn(),
    }) as unknown as typeof globalThis.matchMedia;

    return {
        fireChange: () => listeners.forEach((cb) => cb()),
    };
}

describe("useIsMobile", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("retorna false quando a largura da janela é maior que o breakpoint mobile", () => {
        mockMatchMedia();
        vi.spyOn(globalThis, "innerWidth", "get").mockReturnValue(1024);

        const { result } = renderHook(() => useIsMobile());

        expect(result.current).toBe(false);
    });

    it("atualiza para true quando o evento de mudança do matchMedia dispara em largura mobile", () => {
        const { fireChange } = mockMatchMedia();
        vi.spyOn(globalThis, "innerWidth", "get").mockReturnValue(1024);

        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        vi.spyOn(globalThis, "innerWidth", "get").mockReturnValue(400);
        act(() => {
            fireChange();
        });

        expect(result.current).toBe(true);
    });
});
