'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/user"
import { UserUpdateRequest } from "@/lib/user/types";
import { QUERY_KEY_LIST_USERS } from "./useUsersList";
import { toast } from "@/lib/toast";

export const useUserPatch = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ userId, cpf, nome, rf, sobrenome, tipo_usuario, usuario }: UserUpdateRequest & { userId: string }) => {
            return updateUser(userId, { cpf, nome, rf, sobrenome, tipo_usuario, usuario })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
            handleCloseModalDataForm()
            toast.success('Atualizar Usuário', 'Usuário atualizado com sucesso!')
        },
        onError: () => {
            toast.error('Atualizar Usuário', 'Ocorreu um erro inesperado ao atualizar o usuário')
        }
    })
    return { mutationPatch }
}
