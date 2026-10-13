'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";
import { TClientPatchRequest } from "@/lib/client/types";

export const useClientPatch = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ id, nome, client_id, atributos, client_publico, redirect_uris, web_origins }: TClientPatchRequest & { id: string }) => {
            return updateClient(id, { nome, client_id, atributos, client_publico, redirect_uris, web_origins })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            alert('Cliente atualizado com sucesso')
            handleCloseModalDataForm()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationPatch }
}
