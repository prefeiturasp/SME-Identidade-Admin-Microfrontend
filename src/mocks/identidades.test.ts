import { describe, expect, it } from "vitest";
import { identidadesMock } from "./identidades";

describe("identidadesMock", () => {
  it("fornece identidades com os campos esperados", () => {
    expect(identidadesMock).toHaveLength(3);
    expect(identidadesMock).toEqual([
      { identidade: "123456789-12", nome: "João Silva", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
      { identidade: "Rafael.risso", nome: "Rafael Risso", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
      { identidade: "helio.teste", nome: "", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
    ]);
  });
});
