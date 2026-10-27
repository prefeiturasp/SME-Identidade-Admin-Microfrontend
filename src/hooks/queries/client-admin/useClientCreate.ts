'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/client"
import { TClientCreateRequest } from "@/lib/client/types";
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";
import { toast } from "@/lib/toast";

export const useClientCreate = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: ({ nome, client_id, client_publico, atributos, redirect_uris, web_origins }: TClientCreateRequest) => {
            return createClient({ nome, client_id, client_publico, atributos, redirect_uris, web_origins })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            handleCloseModalDataForm()
            toast.success("Novo Cliente", "Cliente criado com sucesso!")
        },
        onError: () => {
            toast.error("Novo Cliente", "Erro ao criar cliente. Por favor, tente novamente.")
        }
    })
    return { mutationPost }
}
