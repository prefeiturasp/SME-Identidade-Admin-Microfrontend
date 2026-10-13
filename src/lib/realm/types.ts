export type RealmData = {
    id: string | null,
    nome: string | null,
    nome_exibicao: string | null,
    habilitado: boolean,
    oficial: boolean,
    finalidade: string | null,
    padrao: boolean,
    protegido: boolean
};

export type RealmCreateRequest = {
    nome: string,
    nome_exibicao?: string,
    habilitado?: boolean,
    oficial?: boolean,
    finalidade?: string
};

export type RealmUpdateRequest = {
    nome_exibicao?: string,
    habilitado?: boolean,
    oficial?: boolean,
    finalidade?: string
};

export type MensagemResponse = {
    mensagem: string
};

export type FinalidadesResponse = {
    finalidades: string[],
    padrao: string
};
