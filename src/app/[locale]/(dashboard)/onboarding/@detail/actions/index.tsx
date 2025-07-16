'use client'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

export const useDetailModal = () => {
    const { setSearchParams, removeSearchParam, getSearchParam } =
        useSearchParam()

    const openModal = (projectId: string | number) => {
        setSearchParams({ detail: projectId.toString() })
    }

    const detailId = getSearchParam('detail')

    const closeModal = () => {
        removeSearchParam('detail')
    }
    return {
        openModal,
        closeModal,
        detailId,
    }
}
