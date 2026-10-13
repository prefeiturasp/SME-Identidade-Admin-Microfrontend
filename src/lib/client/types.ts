export type TClientAdmin = {
    id: string;
    client_id: string;
    nome: string;
    habilitado: boolean;
    client_publico: boolean;
    protocolo: string;
    redirect_uris: string[];
    web_origins: string[];
    atributos: Record<string, string>;
}

export type TClientCreateRequest = Omit<TClientAdmin, 'id' | 'habilitado' | 'protocolo'>

export type TClientPatchRequest = Partial<TClientCreateRequest>

export type TClientListResponse = TClientAdmin[];

export type TClientRotateSecretResponse = {
    id: string;
    secret: string;
}
