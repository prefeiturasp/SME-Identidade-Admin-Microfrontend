import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminMsApi } from "@/lib/axios-admin";
import { createClient, disableClient, getClients, rotateClientSecret, updateClient } from "./index";

describe("client API", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("lista e cria clientes", async () => {
    const clients = [{ id: "c1", nome: "Portal" }];
    const get = vi.spyOn(adminMsApi, "get").mockResolvedValue({ data: clients });
    const post = vi.spyOn(adminMsApi, "post").mockResolvedValue({ data: clients[0] });
    await expect(getClients()).resolves.toEqual(clients);
    await expect(createClient({ nome: "Portal" } as never)).resolves.toEqual(clients[0]);
    expect(get).toHaveBeenCalledWith("clientes/");
    expect(post).toHaveBeenCalledWith("clientes/", { nome: "Portal" });
  });

  it("atualiza e desativa cliente", async () => {
    const patch = vi.spyOn(adminMsApi, "patch").mockResolvedValue({ data: null });
    await expect(updateClient("c1", { nome: "Portal" })).resolves.toBeNull();
    await expect(disableClient("c1")).resolves.toBeNull();
    expect(patch).toHaveBeenNthCalledWith(1, "clientes/c1/", { nome: "Portal" });
    expect(patch).toHaveBeenNthCalledWith(2, "clientes/c1/", { habilitado: false });
  });

  it("rotaciona o segredo", async () => {
    const response = { data: { id: "c1", secret: "novo-segredo" } };
    const post = vi.spyOn(adminMsApi, "post").mockResolvedValue(response);
    await expect(rotateClientSecret("c1")).resolves.toEqual(response.data);
    expect(post).toHaveBeenCalledWith("clientes/c1/secret/rotacionar/");
  });
});
