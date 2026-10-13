'use client'

import { useQuery } from '@tanstack/react-query'

import { getClients } from '@/lib/client'
import type { TClientListResponse } from '@/lib/client/types'

export const QUERY_KEY_LIST_CLIENTS = 'list-clients'

export function useClientsList() {
    return useQuery<TClientListResponse>({
        queryKey: [QUERY_KEY_LIST_CLIENTS],
        queryFn: getClients,
    })
}
