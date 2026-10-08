'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/lib/user"
import { QUERY_KEY_LIST_USERS } from "./useUsersList";

export const useUserDelete = () => {

    const queryClient = useQueryClient()

    const mutationDelete = useMutation({
        mutationFn: ({ userId }: { userId: string }) => {
            return deleteUser(userId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationDelete }
}
