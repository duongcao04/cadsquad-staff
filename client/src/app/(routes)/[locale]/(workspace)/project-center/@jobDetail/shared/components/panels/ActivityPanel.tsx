'use client'

import { Job } from '@/shared/interfaces'
import { Skeleton, Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { CommentTab, WorkLogTab } from '../tabs'

type Props = {
    data: Job
    isLoading?: boolean
}
export function ActivityPanel({ isLoading = false, data }: Props) {
    const t = useTranslations()
    return (
        <div className="col-span-3">
            <Skeleton className="w-fit h-fit rounded-md" isLoaded={!isLoading}>
                <p className="text-lg font-medium">{t('activity')}</p>
            </Skeleton>
            <div className="mt-3 space-y-3">
                <Tabs aria-label="Job action tabs">
                    <Tab key="1" title={t('workLog')}>
                        <WorkLogTab jobId={data?.id?.toString()} />
                    </Tab>
                    <Tab key="2" title={t('comments')}>
                        <CommentTab jobId={data?.id?.toString()} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
