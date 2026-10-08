'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/user"
import { UserCreateRequest } from "@/lib/user/types";
import { QUERY_KEY_LIST_USERS } from "./useUsersList";

export const useUserCreate = () => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ cpf, email, nome, rf, sobrenome, tipo_usuario, usuario }: UserCreateRequest) => {
            return createUser({ cpf, email, nome, rf, sobrenome, tipo_usuario, usuario })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationPost }
}
