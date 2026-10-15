export interface UsuarioLogado {
    nome: string;
    login: string;
    email: string;
    rf: string;
}

export interface ResultadoLogin {
    usuario: UsuarioLogado;
    roles: string[];
    sessaoId: string;
    expiraEm: string;
}

export type SituacaoSessao = "valida" | "encerrada";
