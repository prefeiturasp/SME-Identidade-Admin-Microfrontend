import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DashboardPage from "@/app/dashboard/page";

const mocks = vi.hoisted(() => ({
    useRealmsList: vi.fn(),
    useUsersList: vi.fn(),
    useClientsList: vi.fn(),
    useRealmFinalidades: vi.fn(),
    selecionarRealm: vi.fn(),
    limparRealm: vi.fn(),
    realmAtivo: { valor: null as string | null },
}));

vi.mock("@/hooks/queries/realm/useRealmsList", () => ({ useRealmsList: mocks.useRealmsList }));
vi.mock("@/hooks/queries/realm/useRealmFinalidades", () => ({ useRealmFinalidades: mocks.useRealmFinalidades }));
vi.mock("@/hooks/queries/client-admin/useClientsList", () => ({ useClientsList: mocks.useClientsList }));
vi.mock("@/hooks/queries/user/useUsersList", () => ({ useUsersList: mocks.useUsersList }));
vi.mock("@/providers/RealmAtivoProvider", () => ({
    useRealmAtivo: () => ({
        realmAtivo: mocks.realmAtivo.valor,
        selecionarRealm: mocks.selecionarRealm,
        limparRealm: mocks.limparRealm,
    }),
}));
vi.mock("@/components/dashboard/RealmFormDialog", () => ({
    RealmFormDialog: ({ open, realm }: { open: boolean, realm?: { nome: string } | null }) =>
        open ? <div data-testid="realm-dialog">{realm ? `editar:${realm.nome}` : "criar"}</div> : null,
}));

const realms = [
    { id: "r1", nome: "sme-apps", nome_exibicao: "SME Apps", habilitado: true, oficial: true, finalidade: null, padrao: false, protegido: true },
    { id: "r2", nome: "master", nome_exibicao: "Keycloak", habilitado: true, oficial: true, finalidade: null, padrao: false, protegido: true },
    { id: "r6", nome: "COTIC", nome_exibicao: "COTIC", habilitado: true, oficial: true, finalidade: null, padrao: true, protegido: true },
    { id: "r3", nome: "sme-nondas", nome_exibicao: null, habilitado: true, oficial: false, finalidade: null, padrao: false, protegido: false },
    { id: "r4", nome: "sandbox", nome_exibicao: null, habilitado: false, oficial: false, finalidade: "Sandbox", padrao: false, protegido: false },
    { id: "r5", nome: "ux", nome_exibicao: null, habilitado: true, oficial: false, finalidade: "UX", padrao: false, protegido: false },
];

function mockRealms(retorno: Partial<{ data: unknown, isLoading: boolean, isError: boolean }>) {
    mocks.useRealmsList.mockReturnValue({ data: undefined, isLoading: false, isError: false, ...retorno });
}

describe("DashboardPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.realmAtivo.valor = null;
        mocks.useRealmFinalidades.mockReturnValue({ data: { finalidades: ["Sandbox", "UX"], padrao: "Uso regular" } });
        mocks.useUsersList.mockReturnValue({ data: { count: 42, page: 1, results: [] }, isLoading: false });
        mocks.useClientsList.mockReturnValue({ data: Array.from({ length: 7 }, (_, i) => ({ id: `c${i}` })), isLoading: false });
    });

    it("renderiza contadores e separa topologia oficial de outros / testes", () => {
        mockRealms({ data: realms });
        render(<DashboardPage />);

        expect(screen.getByText("Painel de controle")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("Todos os realms")).toBeInTheDocument();
        expect(screen.getAllByText("Realm: COTIC (padrão)")).toHaveLength(2);
        expect(screen.queryByRole("button", { name: "Limpar seleção" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Selecionado" })).toBeDisabled();
        expect(within(screen.getByTestId("topologia-oficial")).getAllByText("COTIC").length).toBeGreaterThan(0);
        expect(screen.getByText("Sistemas (Clients)")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
        expect(mocks.useUsersList).toHaveBeenCalledWith({ page: 1, pageSize: 1 });

        expect(screen.getByText("Topologia oficial SME")).toBeInTheDocument();
        const oficial = screen.getByTestId("topologia-oficial");
        expect(within(oficial).getByText("sme-apps")).toBeInTheDocument();
        expect(within(oficial).getByText("Keycloak")).toBeInTheDocument();
        expect(within(oficial).queryByText("sme-nondas")).not.toBeInTheDocument();

        const tabela = screen.getByRole("table");
        expect(within(tabela).getByText("sme-nondas")).toBeInTheDocument();
        expect(within(tabela).getByText("Uso regular")).toBeInTheDocument();
        expect(within(tabela).getByText("Teste / Sandbox")).toBeInTheDocument();
        expect(within(tabela).getByText("Teste / UX")).toBeInTheDocument();
        expect(within(tabela).getByText("Desabilitado")).toBeInTheDocument();
        expect(within(tabela).queryByText("Nome de exibição")).not.toBeInTheDocument();
        expect(within(tabela).queryByText("sme-apps")).not.toBeInTheDocument();
        expect(screen.getByText("Outros / testes")).toBeInTheDocument();
    });

    it("usa Produção como rótulo padrão enquanto as finalidades não carregam", () => {
        mocks.useRealmFinalidades.mockReturnValue({ data: undefined });
        mockRealms({ data: realms });
        render(<DashboardPage />);

        expect(within(screen.getByRole("table")).getByText("Produção")).toBeInTheDocument();
    });

    it("trata o realm padrão escolhido como ausência de seleção explícita", () => {
        mocks.realmAtivo.valor = "COTIC";
        mockRealms({ data: realms });
        render(<DashboardPage />);

        expect(screen.queryByRole("button", { name: "Limpar seleção" })).not.toBeInTheDocument();
        expect(screen.getAllByText("Realm: COTIC (padrão)")).toHaveLength(2);
    });

    it("indica realm padrão genérico enquanto os realms não carregam", () => {
        mockRealms({ data: [] });
        render(<DashboardPage />);

        expect(screen.getAllByText("Realm: padrão")).toHaveLength(2);
    });

    it("exibe carregamento nas duas seções", () => {
        mockRealms({ isLoading: true });
        mocks.useUsersList.mockReturnValue({ data: undefined, isLoading: true });
        mocks.useClientsList.mockReturnValue({ data: undefined, isLoading: true });
        render(<DashboardPage />);

        expect(screen.getAllByTestId("realms-carregando")).toHaveLength(2);
    });

    it("exibe erro ao carregar realms", () => {
        mockRealms({ isError: true });
        render(<DashboardPage />);

        expect(screen.getAllByText("Não foi possível carregar os realms.")).toHaveLength(2);
    });

    it("exibe estados vazios", () => {
        mockRealms({ data: [] });
        render(<DashboardPage />);

        expect(screen.getByText("Nenhum realm na topologia oficial.")).toBeInTheDocument();
        expect(screen.getByText("Nenhum realm em outros / testes.")).toBeInTheDocument();
    });

    it("abre o dialog em modo criação e em modo edição", async () => {
        const user = userEvent.setup();
        mockRealms({ data: realms });
        render(<DashboardPage />);

        await user.click(screen.getByRole("button", { name: /Novo realm/ }));
        expect(screen.getByTestId("realm-dialog")).toHaveTextContent("criar");

        expect(screen.getAllByRole("button", { name: /^Editar / })).toHaveLength(6);

        await user.click(screen.getByRole("button", { name: "Editar sme-apps" }));
        expect(screen.getByTestId("realm-dialog")).toHaveTextContent("editar:sme-apps");

        await user.click(screen.getByRole("button", { name: "Editar sandbox" }));
        expect(screen.getByTestId("realm-dialog")).toHaveTextContent("editar:sandbox");
    });

    it("seleciona o realm de trabalho e indica o já selecionado", async () => {
        const user = userEvent.setup();
        mocks.realmAtivo.valor = "master";
        mockRealms({ data: realms });
        render(<DashboardPage />);

        const selecionado = screen.getByRole("button", { name: "Selecionado" });
        expect(selecionado).toBeDisabled();

        expect(screen.getAllByText("Realm: master")).toHaveLength(2);
        expect(screen.getByText(/Exibindo sistemas e usuários do realm/)).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Limpar seleção" }));
        expect(mocks.limparRealm).toHaveBeenCalled();

        const selecionar = screen.getAllByRole("button", { name: "Selecionar" });
        expect(selecionar).toHaveLength(5);

        await user.click(selecionar[0]);
        expect(mocks.selecionarRealm).toHaveBeenCalledWith("sme-apps");

        const linhaDesabilitada = screen.getByText("sandbox").closest("tr")!;
        expect(within(linhaDesabilitada).getByRole("button", { name: "Selecionar" })).toBeDisabled();
    });
});
