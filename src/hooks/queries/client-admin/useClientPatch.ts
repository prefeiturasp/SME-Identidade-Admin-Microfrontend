'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";
import { TClientPatchRequest } from "@/lib/client/types";
import { toast } from "@/lib/toast";

export const useClientPatch = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ id, nome, client_id, atributos, client_publico, redirect_uris, web_origins }: TClientPatchRequest & { id: string }) => {
            return updateClient(id, { nome, client_id, atributos, client_publico, redirect_uris, web_origins })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            handleCloseModalDataForm()
            toast.success("Atualizar Cliente", "Cliente atualizado com sucesso!")
        },
        onError: () => {
            toast.error("Atualizar Cliente", "Erro ao atualizar cliente. Por favor, tente novamente.")
        }
    })
    return { mutationPatch }
}
