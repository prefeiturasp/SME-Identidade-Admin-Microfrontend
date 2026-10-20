'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/client"
import { TClientCreateRequest } from "@/lib/client/types";
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";

export const useClientCreate = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ nome, client_id, client_publico, atributos, redirect_uris, web_origins }: TClientCreateRequest) => {
            return createClient({ nome, client_id, client_publico, atributos, redirect_uris, web_origins })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            handleCloseModalDataForm()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationPost }
}
