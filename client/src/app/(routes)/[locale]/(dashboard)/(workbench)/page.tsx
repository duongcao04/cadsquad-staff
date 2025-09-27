'use client'

import React from 'react'
import { useJobs } from '@/shared/queries/useJob'
import JobTable from '../../../../../shared/components/tables/JobTable'

export default function WorkbenchPage() {
    /**
     * Get initial data
     */
    const { jobs, isLoading: loadingJobs } = useJobs({
        tab: 'active',
        limit: 20,
        hideFinishItems: 1,
    })
    return (
        <div className="size-full">
            <JobTable
                isLoading={loadingJobs}
                data={jobs!}
                showColumns={[
                    'thumbnail',
                    'no',
                    'displayName',
                    'staffCost',
                    'assignee',
                    'attachmentUrls',
                    'isPaid',
                    'dueAt',
                    'status',
                    'action',
                ]}
                tableOptions={{ scroll: { x: 'max-content', y: 61 * 11 + 20 } }}
            />
        </div>
    )
}
