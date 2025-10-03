'use client'

import React from 'react'
import { useJobs } from '@/shared/queries/useJob'
import { JobTable } from '../onboarding'
import PageHeading from '../_components/PageHeading'

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
        <>
            <PageHeading title="Workbench" />
            <div className="w-full h-[calc(100%-54px-12px)]">
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
                    tableOptions={{
                        scroll: { x: 'max-content', y: 61 * 11 + 20 },
                    }}
                />
            </div>
        </>
    )
}
