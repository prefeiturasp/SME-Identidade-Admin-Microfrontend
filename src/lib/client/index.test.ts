import { beforeEach, describe, expect, it, vi } from "vitest";

import { adminMsApi } from "@/lib/axios-admin";
import { getClients } from "./index";

describe("client API", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("lista clients", async () => {
        const response = { data: [{ id: "c1", client_id: "sme-identidade-admin" }] };
        const get = vi.spyOn(adminMsApi, "get").mockResolvedValue(response);

        await expect(getClients()).resolves.toEqual(response.data);
        expect(get).toHaveBeenCalledWith("clientes/");
    });
});
