'use client'

import { useJobs } from '@/lib/queries'
import { PageHeading } from '@/shared/components'
import { useTranslations } from 'next-intl'
import { WorkbenchTable } from './shared'

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
                <WorkbenchTable
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
