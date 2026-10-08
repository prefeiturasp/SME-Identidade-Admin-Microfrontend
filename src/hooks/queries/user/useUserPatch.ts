'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/user"
import { UserUpdateRequest } from "@/lib/user/types";
import { QUERY_KEY_LIST_USERS } from "./useUsersList";

export const useUserPatch = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ userId, cpf, nome, rf, sobrenome, tipo_usuario, usuario }: UserUpdateRequest & { userId: string }) => {
            return updateUser(userId, { cpf, nome, rf, sobrenome, tipo_usuario, usuario })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
            handleCloseModalDataForm()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationPatch }
}
