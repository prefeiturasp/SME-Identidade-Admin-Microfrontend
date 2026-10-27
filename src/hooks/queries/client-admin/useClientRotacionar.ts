'use client'

import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rotateClientSecret } from "@/lib/client"
import { QUERY_KEY_LIST_CLIENTS } from "./useClientsList";
import { toast } from "@/lib/toast";

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
            toast.success("Rotacionar Secret", "Secret do cliente rotacionado com sucesso!")
        },
        onError: () => {
            toast.error("Rotacionar Secret", "Erro ao rotacionar o secret. Por favor, tente novamente.")
        }
    })

    const isLoadingClientRotate = useMemo(() => mutationRotate.isPending, [mutationRotate.isPending])

    return { mutationRotate, isLoadingClientRotate }
}
