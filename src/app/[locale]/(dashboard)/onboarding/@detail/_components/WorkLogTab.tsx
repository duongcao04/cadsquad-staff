'use client'

import React from 'react'
import { useJobActivityLogs } from '@/queries/useJob'
import { Spinner } from '@heroui/react'
import { useJobStatusDetail } from '@/queries/useJobStatus'

function ChangeStatusLog({
    fromStatusId,
    toStatusId,
}: {
    fromStatusId?: string
    toStatusId?: string
}) {
    const { jobStatus: fromStatus } = useJobStatusDetail(fromStatusId)
    const { jobStatus: toStatus } = useJobStatusDetail(toStatusId)
    return <div></div>
}

type Props = {
    jobId?: number
}
export default function WorkLogTab({ jobId }: Props) {  
     
     
     
     
      
     
     
    const { activityLogs } = useJobActivityLogs(String(jobId))

    if (!jobId) {
        return <Spinner />
    }

    return (
        <div>
            {activityLogs?.map((log) => {
                return <div key={log.id}></div>
            })}
        </div>
    )
}
