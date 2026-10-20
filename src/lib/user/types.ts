export type UserCreateRequest = {
    usuario: string,
    nome: string,
    sobrenome: string,
    email: string,
    cpf: string,
    rf: string | null
    tipo_usuario: string
};

export type UserCreateResponse = {
    id: string
}

export type UserData = Pick<UserCreateRequest, "cpf" | "rf" | "tipo_usuario"> & UserCreateResponse & {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    enabled: boolean,
    emailVerified: boolean
};

export type UserListRequest = {
    page: number,
    pageSize: number
}

export type UserListResponse = {
    count: number,
    page: number,
    results: UserData[]
};

export type UserUpdateRequest = Partial<Omit<UserCreateRequest, "email">>

export type UserUpdateEmailRequest = {
    email: string
}

export type UserUpdateEmailResponse = {
    email_alterado: boolean,
    verificacao_enviada: boolean
}
