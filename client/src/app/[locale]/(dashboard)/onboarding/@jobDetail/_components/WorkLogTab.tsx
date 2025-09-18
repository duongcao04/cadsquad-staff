'use client'

import React from 'react'
import { useJobActivityLogs } from '@/queries/useJob'
import { Spinner } from '@heroui/react'
import LogCard from './cards/LogCard'

type Props = {
    jobId?: string
}
export default function WorkLogTab({ jobId }: Props) {
    const { activityLogs } = useJobActivityLogs(jobId)

    if (!jobId) {
        return <Spinner />
    }

    return (
        <div className="space-y-7">
            {activityLogs?.map((log) => {
                return (
                    <div key={log.id}>
                        <LogCard data={log} />
                    </div>
                )
            })}
        </div>
    )
}
