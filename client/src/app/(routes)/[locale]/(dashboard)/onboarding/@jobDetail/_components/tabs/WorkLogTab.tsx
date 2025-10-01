'use client'

import React from 'react'
import { useJobActivityLogs } from '@/shared/queries/useJob'
import { Spinner } from '@heroui/react'
import LogCard from '../cards/LogCard'

type Props = {
    jobId?: string
}
export default function WorkLogTab({ jobId }: Props) {
    const { activityLogs } = useJobActivityLogs(jobId)

    if (!jobId) {
        return <Spinner />
    }

    return (
        <div>
            <div className="space-y-7">
                {activityLogs?.length ? (
                    activityLogs?.map((log) => {
                        return (
                            <div key={log.id}>
                                <LogCard data={log} />
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center gap-0.5 text-text1p5 pt-6 pb-8">
                        <h3 className="text-sm font-semibold">
                            Không có bản ghi
                        </h3>
                        <p className="mt-0.5 text-xs">
                            Tất cả các thay đổi và hoạt động liên quan đến công
                            việc sẽ được ghi lại và hiển thị tại đây
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
