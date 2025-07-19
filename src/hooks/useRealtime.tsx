import { useEffect, useState } from 'react'

import type {
    RealtimeChannel,
    RealtimePostgresChangesPayload,
} from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase/client'

// Generic interface for database records
interface DatabaseRecord {
    id: string | number
    created_at?: string
    updated_at?: string
    [key: string]: unknown
}

// Hook return type
interface UseRealtimeReturn<T> {
    data: T[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

// Hook options
interface UseRealtimeOptions {
    orderBy?: {
        column: string
        ascending?: boolean
    }
    filter?: {
        column: string
        operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in'
        value: unknown
    }[]
    limit?: number
}

export function useRealtime<T extends DatabaseRecord>(
    tableName: string,
    query: string = '*',
    options?: UseRealtimeOptions
): UseRealtimeReturn<T> {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Refetch function
    const refetch = async (): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            let queryBuilder = supabase.from(tableName).select(query)

            // Apply filters
            if (options?.filter) {
                options.filter.forEach(({ column, operator, value }) => {
                    queryBuilder = queryBuilder.filter(column, operator, value)
                })
            }

            // Apply ordering
            if (options?.orderBy) {
                queryBuilder = queryBuilder.order(options.orderBy.column, {
                    ascending: options.orderBy.ascending ?? true,
                })
            }

            // Apply limit
            if (options?.limit) {
                queryBuilder = queryBuilder.limit(options.limit)
            }

            const { data: initialData, error: fetchError } = await queryBuilder

            if (fetchError) {
                throw new Error(fetchError.message)
            }

            setData((initialData as T[]) || [])
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Unknown error occurred'
            setError(errorMessage)
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let subscription: RealtimeChannel | null = null

        const setupRealtimeSubscription = async () => {
            // Fetch initial data
            await refetch()

            // Set up realtime subscription
            subscription = supabase
                .channel(`public:${tableName}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: tableName,
                    },
                    (payload: RealtimePostgresChangesPayload<T>) => {
                        console.log(
                            'Realtime event:',
                            payload.eventType,
                            payload
                        )

                        switch (payload.eventType) {
                            case 'INSERT':
                                if (payload.new) {
                                    setData((current) => {
                                        // Check if item already exists to prevent duplicates
                                        const exists = current.some(
                                            (item) => item.id === payload.new.id
                                        )
                                        if (exists) return current

                                        // Add new item based on ordering
                                        if (
                                            options?.orderBy?.ascending ===
                                            false
                                        ) {
                                            return [
                                                payload.new as T,
                                                ...current,
                                            ]
                                        }
                                        return [...current, payload.new as T]
                                    })
                                }
                                break

                            case 'UPDATE':
                                if (payload.new) {
                                    setData((current) =>
                                        current.map((item) =>
                                            item.id === payload.new.id
                                                ? ({
                                                      ...item,
                                                      ...payload.new,
                                                  } as T)
                                                : item
                                        )
                                    )
                                }
                                break

                            case 'DELETE':
                                if (payload.old) {
                                    setData((current) =>
                                        current.filter(
                                            (item) => item.id !== payload.old.id
                                        )
                                    )
                                }
                                break

                            default:
                                console.warn(
                                    'Unhandled realtime event:',
                                    payload.eventType
                                )
                        }
                    }
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log(
                            `Subscribed to realtime changes for ${tableName}`
                        )
                    } else if (status === 'CHANNEL_ERROR') {
                        console.error(`Error subscribing to ${tableName}`)
                        setError('Failed to subscribe to realtime updates')
                    }
                })
        }

        setupRealtimeSubscription()

        // Cleanup function
        return () => {
            if (subscription) {
                supabase.removeChannel(subscription)
                console.log(`Unsubscribed from ${tableName} realtime changes`)
            }
        }
    }, [tableName, query, JSON.stringify(options)]) // Include options in dependency array

    return { data, loading, error, refetch }
}

// Specialized hooks for common use cases
export function useRealtimeWithFilter<T extends DatabaseRecord>(
    tableName: string,
    column: string,
    value: unknown,
    query: string = '*'
): UseRealtimeReturn<T> {
    return useRealtime<T>(tableName, query, {
        filter: [{ column, operator: 'eq', value }],
    })
}

export function useRealtimeOrdered<T extends DatabaseRecord>(
    tableName: string,
    orderColumn: string,
    ascending: boolean = true,
    query: string = '*',
    limit?: number
): UseRealtimeReturn<T> {
    return useRealtime<T>(tableName, query, {
        orderBy: { column: orderColumn, ascending },
        limit,
    })
}
