'use client'

import { useQuery } from '@tanstack/react-query'

import { getRealms } from '@/lib/realm'
import type { RealmData } from '@/lib/realm/types'

export const QUERY_KEY_LIST_REALMS = 'list-realms'

export function useRealmsList() {
    return useQuery<RealmData[]>({
        queryKey: [QUERY_KEY_LIST_REALMS],
        queryFn: () => getRealms(),
    })
}
