'use client'

import React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export default function TanstackQueryProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
        </QueryClientProvider>
    )
}
