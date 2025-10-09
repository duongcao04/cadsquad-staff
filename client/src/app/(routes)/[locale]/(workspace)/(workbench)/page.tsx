'use client'

import { PageHeading } from '@/shared/components'
import { useJobs } from '@/shared/queries'
import { useTranslations } from 'next-intl'
import { JobTable } from '../project-center/shared'

export default function WorkbenchPage() {
    const t = useTranslations()
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
            <PageHeading title={t('workbench')} />
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
