'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRealm } from "@/lib/realm"
import { extrairMensagemErro } from "@/lib/api-error";
import { RealmUpdateRequest } from "@/lib/realm/types";
import { QUERY_KEY_LIST_REALMS } from "./useRealmsList";

export const useRealmPatch = ({ handleCloseModal }: { handleCloseModal: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPatch = useMutation({
        mutationFn: ({ nome, ...realmData }: RealmUpdateRequest & { nome: string }) => {
            return updateRealm(nome, realmData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_REALMS] }).then()
            handleCloseModal()
        },
        onError: (error) => {
            alert(extrairMensagemErro(error))
        }
    })
    return { mutationPatch }
}
