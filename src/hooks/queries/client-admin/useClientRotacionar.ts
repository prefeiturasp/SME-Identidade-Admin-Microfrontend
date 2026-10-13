'use client'

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rotateClientSecret } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";

export const useClientRotacionar = ({
    setOpenRotateDialog,
    setDetailRotatedSecret
}: {
    setOpenRotateDialog: (open: boolean) => void;
    setDetailRotatedSecret: ({ clientId, secret }: { clientId: string; secret: string }) => void
}) => {

    const queryClient = useQueryClient()

    const mutationRotate = useMutation({
        mutationFn: ({ id }: { id: string, clientId: string }) => {
            return rotateClientSecret(id)
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_CLIENTS] }).then()
            setOpenRotateDialog(true)
            setDetailRotatedSecret({ clientId: variables.clientId, secret: data.secret })
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })

    const isLoadingClientRotate = useMemo(() => mutationRotate.isPending, [mutationRotate.isPending])

    return { mutationRotate, isLoadingClientRotate }
}
