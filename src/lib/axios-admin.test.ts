import { afterEach, describe, expect, it } from "vitest";

import { adminMsApi, definirRealmAtivo } from "./axios-admin";

describe("definirRealmAtivo", () => {
    afterEach(() => {
        definirRealmAtivo(null);
    });

    it("envia o realm de trabalho no header X-Realm", () => {
        definirRealmAtivo("sme-apps");

        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBe("sme-apps");
    });

    it("remove o header quando nenhum realm é informado", () => {
        definirRealmAtivo("sme-apps");
        definirRealmAtivo(null);

        expect(adminMsApi.defaults.headers.common["X-Realm"]).toBeUndefined();
    });
});
