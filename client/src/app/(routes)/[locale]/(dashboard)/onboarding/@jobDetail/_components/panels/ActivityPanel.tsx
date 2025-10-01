'use client'

import { Tab } from '@heroui/react'
import { Skeleton, Tabs } from '@heroui/react'
import React from 'react'
import WorkLogTab from '../tabs/WorkLogTab'
import { Job } from '@/shared/interfaces/job.interface'
import CommentTab from '../tabs/CommentTab'

type Props = {
    data: Job
    isLoading?: boolean
}
export default function ActivityPanel({ isLoading = false, data }: Props) {
    return (
        <div className="col-span-3">
            <Skeleton className="w-fit h-fit rounded-md" isLoaded={!isLoading}>
                <p className="text-lg font-medium">Activity</p>
            </Skeleton>
            <div className="mt-3 space-y-3">
                <Tabs aria-label="Job action tabs">
                    <Tab key="1" title="Work log">
                        <WorkLogTab jobId={data?.id?.toString()} />
                    </Tab>
                    <Tab key="2" title="Comments">
                        <CommentTab jobId={data?.id?.toString()} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
