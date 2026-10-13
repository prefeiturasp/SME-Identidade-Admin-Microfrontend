'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRealm } from "@/lib/realm"
import { extrairMensagemErro } from "@/lib/api-error";
import { RealmCreateRequest } from "@/lib/realm/types";
import { QUERY_KEY_LIST_REALMS } from "./useRealmsList";

export const useRealmCreate = ({ handleCloseModal }: { handleCloseModal: () => void }) => {

    const queryClient = useQueryClient()

    const mutationPost = useMutation({
        mutationFn: (realmData: RealmCreateRequest) => {
            return createRealm(realmData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_REALMS] }).then()
            handleCloseModal()
        },
        onError: (error) => {
            alert(extrairMensagemErro(error))
        }
    })
    return { mutationPost }
}
