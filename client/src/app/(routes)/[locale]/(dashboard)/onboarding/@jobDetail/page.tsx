'use client'

import React from 'react'
import JobDetailDrawer from '@/shared/components/drawers/JobDetailDrawer'
import { useDetailModal } from '@/shared/actions/useDetailModal'
import { useJobByNo } from '@/shared/queries/useJob'
import { Job } from '@/shared/interfaces/job.interface'

export default function JobDetailView() {
    const { jobNo, isOpen, isEditMode, closeModal } = useDetailModal()
    const { job, isLoading } = useJobByNo(jobNo)

    return (
        <JobDetailDrawer
            data={job as Job}
            isLoading={isLoading}
            isOpen={isOpen}
            isEditMode={isEditMode}
            closeModal={closeModal}
        />
    )
}
