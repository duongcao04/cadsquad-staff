'use client'

import { useCallback, useEffect, useState } from 'react'

export const useDebounce = <T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<
        typeof setTimeout
    > | null>(null)

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            // Clear existing timer
            if (debounceTimer) {
                clearTimeout(debounceTimer)
            }

            // Set new timer
            const newTimer = setTimeout(() => {
                callback(...args)
            }, delay)

            setDebounceTimer(newTimer)
        },
        [callback, delay, debounceTimer]
    )

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer)
            }
        }
    }, [debounceTimer])

    return debouncedCallback
}

// Alternative simpler useDebounce hook for values
export const useDebouncedValue = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}
