'use client'

import { useState } from 'react'

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

export function ReactQueryProvider({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        gcTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 0,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    )
}
