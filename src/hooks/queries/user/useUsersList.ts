'use client'

import { useQuery } from '@tanstack/react-query'

import { getUsers } from '@/lib/user'
import type { UserListResponse } from '@/lib/user/types'

export const QUERY_KEY_LIST_USERS = 'list-users'

export function useUsersList({ page = 1, pageSize = 10 }: { page: number, pageSize: number }) {
    return useQuery<UserListResponse>({
        queryKey: [QUERY_KEY_LIST_USERS, page, pageSize],
        queryFn: () => getUsers({ page, pageSize }),
    })
}
