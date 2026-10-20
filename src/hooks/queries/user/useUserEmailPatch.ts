'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserEmail } from "@/lib/user"
import { UserUpdateEmailRequest } from "@/lib/user/types";
import { QUERY_KEY_LIST_USERS } from "./useUsersList";

export const useUserEmailPatch = ({ handleCloseModalDataForm }: { handleCloseModalDataForm: () => void }) => {

    const queryClient = useQueryClient()

    const mutationEmailPatch = useMutation({
        mutationFn: ({ userId, email, }: UserUpdateEmailRequest & { userId: string, needInvalidateQuery: boolean }) => {
            return updateUserEmail(userId, { email })
        },
        onSuccess: (_, variables) => {
            if (variables.needInvalidateQuery) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY_LIST_USERS] }).then()
                handleCloseModalDataForm();
            }
        },
        onError: () => {
            alert('Ocorreu um erro inesperado')
        }
    })
    return { mutationEmailPatch }
}
