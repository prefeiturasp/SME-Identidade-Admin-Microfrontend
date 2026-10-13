export interface ClientMock {
    identificador: string;
    id: string;
    nome: string;
    protocolo: string;
    status: string;
}

export const clientsMock: ClientMock[] = [
    { identificador: "account", id: "8000474l-7960-4018-b375-f0b46e9d9l3b", nome: "${client_account}", protocolo: "OPENID-CONNECT", status: "Ativo" },
    { identificador: "account-console", id: "c1f5173a-69c2-47e0-94e1-95de6a7917A5", nome: "${client_account-console}", protocolo: "OPENID-CONNECT", status: "Ativo" },
    { identificador: "admin-cli", id: "d12e73da-53c3-42fb-a67e-89e53d372dfd", nome: "${client_admin-cli}", protocolo: "OPENID-CONNECT", status: "Ativo" },
    { identificador: "broker", id: "127acf99-6884-4bc8-a25d-1b64a9fc06a7", nome: "${client_broker}", protocolo: "OPENID-CONNECT", status: "Ativo" },
    { identificador: "realm-management", id: "f455c343-4a67-4032-b6c9-c7be9249b4de", nome: "${client_realm-management}", protocolo: "OPENID-CONNECT", status: "Ativo" },
    { identificador: "security-admin-console", id: "8803e1cc-b162-455a-9bdd-04d204f225c5", nome: "${client_security-admin-console}", protocolo: "OPENID-CONNECT", status: "Ativo" },
];
