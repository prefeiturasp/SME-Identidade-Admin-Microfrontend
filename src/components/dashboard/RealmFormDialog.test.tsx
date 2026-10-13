import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RealmFormDialog } from "./RealmFormDialog";

const mutatePost = vi.fn();
const mutatePatch = vi.fn();

vi.mock("@/hooks/queries/realm/useRealmCreate", () => ({
    useRealmCreate: () => ({ mutationPost: { mutate: mutatePost, isPending: false } }),
}));
vi.mock("@/hooks/queries/realm/useRealmPatch", () => ({
    useRealmPatch: () => ({ mutationPatch: { mutate: mutatePatch, isPending: false } }),
}));
vi.mock("@/hooks/queries/realm/useRealmFinalidades", () => ({
    useRealmFinalidades: () => ({ data: { finalidades: ["Sandbox", "UX"], padrao: "Produção" } }),
}));

const realmOutro = { id: "r1", nome: "sandbox", nome_exibicao: "Sandbox", habilitado: true, oficial: false, finalidade: "Sandbox", padrao: false, protegido: false };
const realmOficial = { id: "r2", nome: "sme-apps", nome_exibicao: "SME Apps", habilitado: true, oficial: true, finalidade: null, padrao: false, protegido: true };

describe("RealmFormDialog", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("cria realm fora da topologia oficial e desabilitado", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} />);

        expect(screen.getByText("Novo realm")).toBeInTheDocument();
        const salvar = screen.getByRole("button", { name: "Salvar" });
        expect(salvar).toBeDisabled();

        await user.type(screen.getByLabelText("Nome do realm*"), " sandbox ");
        await user.type(screen.getByLabelText("Nome de exibição"), "Sandbox");
        await user.selectOptions(screen.getByLabelText("Finalidade"), "UX");
        await user.click(screen.getByLabelText("Desabilitado"));
        await user.click(salvar);

        expect(mutatePost).toHaveBeenCalledWith({ nome: "sandbox", nome_exibicao: "Sandbox", habilitado: false, oficial: false, finalidade: "UX" });
        expect(mutatePatch).not.toHaveBeenCalled();
    });

    it("ao marcar topologia oficial, força habilitado e bloqueia a opção", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} />);

        await user.type(screen.getByLabelText("Nome do realm*"), "sme-apps");
        await user.click(screen.getByLabelText("Desabilitado"));
        expect(screen.getByLabelText("Desabilitado")).toBeChecked();
        await user.selectOptions(screen.getByLabelText("Finalidade"), "Sandbox");
        await user.click(screen.getByLabelText("Topologia oficial SME"));

        expect(screen.queryByLabelText("Finalidade")).not.toBeInTheDocument();
        expect(screen.getByLabelText("Habilitado")).toBeChecked();
        expect(screen.getByLabelText("Desabilitado")).toBeDisabled();
        expect(screen.getByText(/não podem ser desativados/)).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(mutatePost).toHaveBeenCalledWith({ nome: "sme-apps", nome_exibicao: "", habilitado: true, oficial: true, finalidade: "" });
    });

    it("bloqueia nome com caracteres inválidos", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} />);

        await user.type(screen.getByLabelText("Nome do realm*"), "sme apps");

        expect(screen.getByText("Use apenas letras, números, hífen ou sublinhado.")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    });

    it("em edição de realm comum, mantém o nome fixo e envia só o que mudou", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} realm={realmOutro} />);

        expect(screen.getByText("Editar realm")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome do realm*")).toBeDisabled();
        const salvar = screen.getByRole("button", { name: "Salvar" });
        expect(salvar).toBeDisabled();
        expect(screen.getByLabelText("Habilitado")).toBeChecked();

        await user.click(screen.getByLabelText("Desabilitado"));
        await user.click(salvar);

        expect(mutatePatch).toHaveBeenCalledWith({ nome: "sandbox", habilitado: false });
        expect(mutatePost).not.toHaveBeenCalled();
    });

    it("em edição de realm protegido, não permite desativar mesmo ao retirar a marcação", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} realm={realmOficial} />);

        expect(screen.getByLabelText("Topologia oficial SME")).toBeChecked();
        expect(screen.getByLabelText("Desabilitado")).toBeDisabled();

        await user.click(screen.getByLabelText("Topologia oficial SME"));
        expect(screen.getByLabelText("Desabilitado")).toBeDisabled();

        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(mutatePatch).toHaveBeenCalledWith({ nome: "sme-apps", oficial: false });
    });

    it("em edição, envia o novo nome de exibição", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} realm={realmOutro} />);

        const nomeExibicao = screen.getByLabelText("Nome de exibição");
        await user.clear(nomeExibicao);
        await user.type(nomeExibicao, "Testes");
        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(mutatePatch).toHaveBeenCalledWith({ nome: "sandbox", nome_exibicao: "Testes" });
    });

    it("em edição, permite voltar a finalidade para o uso padrão", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} realm={realmOutro} />);

        const finalidade = screen.getByLabelText("Finalidade");
        expect(finalidade).toHaveValue("Sandbox");
        expect(screen.getByRole("option", { name: "Teste / UX" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Produção" })).toHaveValue("");

        await user.selectOptions(finalidade, "");
        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(mutatePatch).toHaveBeenCalledWith({ nome: "sandbox", finalidade: "" });
    });

    it("em edição de realm desabilitado, permite reabilitar", async () => {
        const user = userEvent.setup();
        render(<RealmFormDialog open onOpenChange={vi.fn()} realm={{ ...realmOutro, habilitado: false }} />);

        expect(screen.getByLabelText("Desabilitado")).toBeChecked();

        await user.click(screen.getByLabelText("Habilitado"));
        await user.click(screen.getByRole("button", { name: "Salvar" }));

        expect(mutatePatch).toHaveBeenCalledWith({ nome: "sandbox", habilitado: true });
    });

    it("fecha ao cancelar", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        render(<RealmFormDialog open onOpenChange={onOpenChange} />);

        await user.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
