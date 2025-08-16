'use client'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

export const useDetailModal = () => {
    const { setSearchParams, removeSearchParam, getSearchParam } =
        useSearchParam()

    const openModal = (jobId: string | number) => {
        setSearchParams({ detail: jobId.toString() })
    }

    const detailId = getSearchParam('detail') ?? undefined

    const closeModal = () => {
        removeSearchParam('detail')
    }
    return {
        openModal,
        closeModal,
        detailId,
    }
}
