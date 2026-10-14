import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "./route";

describe("runtime environment route", () => {
    beforeEach(() => {
        delete process.env.NEXT_PUBLIC_ADMIN_MS_URL;
        delete process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID;
        delete process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET;
    });

    it("returns the configured environment values as JavaScript", async () => {
        process.env.NEXT_PUBLIC_ADMIN_MS_URL = "https://admin.example.com";
        process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID = "client-id";
        process.env.NEXT_PUBLIC_ADMIN_CLIENT_SECRET = "client-secret";

        const response = GET();

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe(
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        );
        expect(response.headers.get("content-type")).toBe(
            "application/javascript; charset=utf-8",
        );
        expect(response.headers.get("expires")).toBe("0");
        expect(response.headers.get("pragma")).toBe("no-cache");
        expect(await response.text()).toBe(
            'globalThis.__ADMIN_CONFIG__ = {"NEXT_PUBLIC_ADMIN_MS_URL":"https://admin.example.com","NEXT_PUBLIC_ADMIN_CLIENT_ID":"client-id","NEXT_PUBLIC_ADMIN_CLIENT_SECRET":"client-secret"};',
        );
    });

    it("uses empty strings when environment values are absent", async () => {
        expect(await GET().text()).toBe(
            'globalThis.__ADMIN_CONFIG__ = {"NEXT_PUBLIC_ADMIN_MS_URL":"","NEXT_PUBLIC_ADMIN_CLIENT_ID":"","NEXT_PUBLIC_ADMIN_CLIENT_SECRET":""};',
        );
    });
});
