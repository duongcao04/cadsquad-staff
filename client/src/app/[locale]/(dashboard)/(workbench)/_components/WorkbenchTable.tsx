'use client'

import React from 'react'
import { useJobs } from '@/shared/queries/useJob'
import JobTable from '../../onboarding/_components/JobTable'

export default function WorkbenchTable() {
    /**
     * Get initial data
     */
    const {
        jobs,
        isLoading: loadingJobs,
        meta,
    } = useJobs({
        tab: 'active',
        hideFinishItems: true,
    })
    return (
        <div
            className="p-2 mt-4 size-full bg-background"
            style={{
                borderRadius: '20px',
            }}
        >
            <JobTable
                isLoading={loadingJobs}
                data={jobs!}
                pagination={{
                    pageSize: 10,
                    current: 1,
                    total: meta?.total,
                }}
            />
        </div>
    )
}
