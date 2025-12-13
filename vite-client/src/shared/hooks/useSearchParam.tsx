import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'

export function useSearchParam() {
    const router = useRouter()
    const { pathname, search } = router.history.location

    const searchParams = new URLSearchParams(search)

    const navigateWithParams = useCallback(
        (
            newSearchParams: URLSearchParams,
            options: { replace?: boolean } = {}
        ) => {
            router.navigate({
                to: pathname,
                search: newSearchParams,
                replace: options.replace,
            })
        },
        [router, pathname]
    )

    const setSearchParams = useCallback(
        (
            params: Record<string, string | null | undefined>,
            options: { replace?: boolean } = {}
        ) => {
            const newSearchParams = new URLSearchParams(search)

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, value)
                }
            })

            navigateWithParams(newSearchParams, options)
        },
        [search, navigateWithParams]
    )

    const getSearchParam = useCallback(
        (key: string) => {
            return searchParams.get(key)
        },
        [searchParams]
    )

    const getAllSearchParams = useCallback(() => {
        return Object.fromEntries(searchParams.entries())
    }, [searchParams])

    const removeSearchParam = useCallback(
        (paramKey: string, options: { replace?: boolean } = {}) => {
            const newSearchParams = new URLSearchParams(search)
            newSearchParams.delete(paramKey)

            navigateWithParams(newSearchParams, options)
        },
        [search, navigateWithParams]
    )

    const removeSearchParams = useCallback(
        (paramKeys: string[], options: { replace?: boolean } = {}) => {
            const newSearchParams = new URLSearchParams(search)

            paramKeys.forEach((key) => {
                newSearchParams.delete(key)
            })

            navigateWithParams(newSearchParams, options)
        },
        [search, navigateWithParams]
    )

    const removeAllSearchParams = useCallback(
        (options: { replace?: boolean } = {}) => {
            navigateWithParams(new URLSearchParams(), options)
        },
        [navigateWithParams]
    )

    const hasSearchParam = useCallback(
        (key: string) => {
            return searchParams.has(key)
        },
        [searchParams]
    )

    const toggleSearchParam = useCallback(
        (key: string, value: string, options: { replace?: boolean } = {}) => {
            const newSearchParams = new URLSearchParams(search)
            const currentValue = newSearchParams.get(key)

            if (currentValue === value) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, value)
            }
            navigateWithParams(newSearchParams, options)
        },
        [search, navigateWithParams]
    )

    const updateSearchParam = useCallback(
        (
            key: string,
            value: string | null | undefined,
            options: { replace?: boolean } = {}
        ) => {
            setSearchParams({ [key]: value }, options)
        },
        [setSearchParams]
    )

    const getSearchParamAsArray = useCallback(
        (key: string, separator: string = ',') => {
            const value = searchParams.get(key)
            return value ? value.split(separator).filter(Boolean) : []
        },
        [searchParams]
    )

    const setSearchParamAsArray = useCallback(
        (
            key: string,
            values: string[],
            separator: string = ',',
            options: { replace?: boolean } = {}
        ) => {
            const value = values.length > 0 ? values.join(separator) : null
            setSearchParams({ [key]: value }, options)
        },
        [setSearchParams]
    )

    const isEmpty = useCallback(() => {
        return searchParams.toString() === ''
    }, [searchParams])

    return {
        searchParams,
        setSearchParams,
        getSearchParam,
        getAllSearchParams,
        removeSearchParam,
        removeSearchParams,
        removeAllSearchParams,
        hasSearchParam,
        toggleSearchParam,
        updateSearchParam,
        getSearchParamAsArray,
        setSearchParamAsArray,
        isEmpty,
    }
}
