'use client'

import { useQuery } from '@tanstack/react-query'

import { getFinalidades } from '@/lib/realm'
import type { FinalidadesResponse } from '@/lib/realm/types'

export const QUERY_KEY_REALM_FINALIDADES = 'realm-finalidades'

export function useRealmFinalidades() {
    return useQuery<FinalidadesResponse>({
        queryKey: [QUERY_KEY_REALM_FINALIDADES],
        queryFn: () => getFinalidades(),
    })
}
