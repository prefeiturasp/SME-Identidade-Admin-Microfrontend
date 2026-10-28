'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableClient } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";
import { toast } from "@/lib/toast";

export const useClientDelete = ({ handleCloseConfirmDelete }: { handleCloseConfirmDelete: () => void }) => {

    const queryClient = useQueryClient()

    const mutationDelete = useMutation({
        mutationFn: ({ id }: { id: string }) => {
            return disableClient(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            handleCloseConfirmDelete()
            toast.success("Desabilitar Cliente", "Cliente desabilitado com sucesso!")
        },
        onError: () => {
            toast.error("Desabilitar Cliente", "Erro ao desabilitar cliente. Por favor, tente novamente.")
        }
    })
    return { mutationDelete }
}
