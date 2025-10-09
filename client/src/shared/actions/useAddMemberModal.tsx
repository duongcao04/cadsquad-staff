'use client'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

export const useAddMemberModal = () => {
    const { setSearchParams, removeSearchParams, getSearchParam } =
        useSearchParam()

    const openModal = (jobNo: string) => {
        setSearchParams({ modal: 'add-member', jobNo: jobNo.toString() })
    }

    const jobNo = getSearchParam('jobNo') ?? undefined
    const modal = getSearchParam('modal') ?? undefined
    const isOpen = modal === 'add-member' && Boolean(jobNo)

    const closeModal = () => {
        removeSearchParams(['modal', 'jobNo'])
    }

    return {
        openModal,
        closeModal,
        jobNo,
        isOpen,
    }
}
