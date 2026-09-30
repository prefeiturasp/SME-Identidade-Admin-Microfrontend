export interface IdentidadeMock {
    identidade: string;
    nome: string;
    tipo: string;
    idSme: string;
    estado: string;
}

export const identidadesMock: IdentidadeMock[] = [
    { identidade: "123456789-12", nome: "João Silva", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
    { identidade: "Rafael.risso", nome: "Rafael Risso", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
    { identidade: "helio.teste", nome: "", tipo: "Externo", idSme: "N/A", estado: "Padrão" },
];
