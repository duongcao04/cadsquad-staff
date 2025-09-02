'use client'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

export const useDetailModal = () => {
    const { setSearchParams, removeSearchParam, getSearchParam } =
        useSearchParam()

    const openModal = (jobNo: string | number) => {
        setSearchParams({ detail: jobNo.toString() })
    }

    const jobNo = getSearchParam('detail') ?? undefined
    const isOpen = Boolean(jobNo)

    const closeModal = () => {
        removeSearchParam('detail')
    }

    return {
        openModal,
        closeModal,
        jobNo,
        isOpen,
    }
}
