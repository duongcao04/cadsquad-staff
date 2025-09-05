'use client'

import { useSearchParam } from '@/shared/hooks/useSearchParam'

type ModalActionMode = 'view' | 'edit'

export const useDetailModal = () => {
    const { setSearchParams, removeSearchParams, getSearchParam } =
        useSearchParam()

    const openModal = (jobNo: string | number) => {
        setSearchParams({ detail: jobNo.toString() })
    }

    const jobNo = getSearchParam('detail') ?? undefined
    const isOpen = Boolean(jobNo)
    const modeQuery = getSearchParam('mode') ?? 'view'
    const actionMode: ModalActionMode = modeQuery === 'edit' ? 'edit' : 'view'

    const isEditMode = actionMode === 'edit'

    const switchMode = (mode: ModalActionMode) => {
        setSearchParams({ mode: mode })
    }

    const closeModal = () => {
        removeSearchParams(['detail', 'mode'])
    }

    return {
        openModal,
        closeModal,
        jobNo,
        isOpen,
        actionMode,
        isEditMode,
        switchMode,
    }
}
