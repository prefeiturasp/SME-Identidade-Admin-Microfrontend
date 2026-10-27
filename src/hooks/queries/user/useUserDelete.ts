'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/user"
import { QUERY_KEY_LIST_USERS } from "./useUsersList";
import { toast } from "@/lib/toast";

export const useUserDelete = ({ handleCloseConfirmDelete }: { handleCloseConfirmDelete: () => void }) => {

    const queryClient = useQueryClient()

    const mutationDelete = useMutation({
        mutationFn: ({ userId }: { userId: string }) => {
            return deleteUser(userId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
            toast.success('Desabilitar Usuário', 'Usuário desabilitado com sucesso')
            handleCloseConfirmDelete()
        },
        onError: () => {
            toast.error('Desabilitar Usuário', 'Ocorreu um erro inesperado ao desabilitar o usuário')
        }
    })
    return { mutationDelete }
}
