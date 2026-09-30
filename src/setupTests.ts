import "@testing-library/jest-dom";

if (!globalThis.matchMedia) {
    globalThis.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    } as MediaQueryList);
}
