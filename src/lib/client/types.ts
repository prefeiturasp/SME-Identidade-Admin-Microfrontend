export type ClientData = {
    id: string,
    client_id: string,
    nome: string,
    habilitado: boolean,
    client_publico: boolean,
    protocolo: string,
    redirect_uris: string[],
    web_origins: string[],
    atributos: Record<string, string>
};
