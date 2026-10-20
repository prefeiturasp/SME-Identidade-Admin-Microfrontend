'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableClient } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";

export const useClientDelete = ({ handleCloseConfirmDelete }: { handleCloseConfirmDelete: () => void }) => {

    const queryClient = useQueryClient()

    const mutationDelete = useMutation({
        mutationFn: ({ id }: { id: string }) => {
            return disableClient(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            alert('Cliente desabilitado com sucesso')
            handleCloseConfirmDelete()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationDelete }
}
