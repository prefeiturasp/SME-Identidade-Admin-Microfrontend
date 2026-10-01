export interface SessaoResumo {
    sessaoId: string;
    login: string;
    sistemas: { sistemaId: string; sistemaNome: string }[];
    expiraEm: string;
}

export interface Usuario {
    nome: string;
    email: string;
    cpf: string;
    rf: string;
    roles: string[];
    realmAtivo: string;
}

export interface Sessao {
    usuario: Usuario;
    sessao: SessaoResumo;
}
