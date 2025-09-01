'use client'

import React, { useState } from 'react'
import { JobActivityLog, JobStatus } from '@/validationSchemas/job.schema'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Image } from 'antd'
import dayjs from 'dayjs'
import { useJobStatusDetail } from '@/queries/useJobStatus'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { MoveRight } from 'lucide-react'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

function ChangeStatusLog({
    fromStatusId,
    toStatusId,
}: {
    fromStatusId?: string
    toStatusId?: string
}) {
    const { jobStatus: fromStatus } = useJobStatusDetail(fromStatusId)
    const { jobStatus: toStatus } = useJobStatusDetail(toStatusId)
    return (
        <div className="flex items-center justify-start gap-4">
            {fromStatus && <JobStatusChip data={fromStatus as JobStatus} />}
            <MoveRight />
            {toStatusId && <JobStatusChip data={toStatus as JobStatus} />}
        </div>
    )
}

type Props = {
    data: JobActivityLog
}
export default function LogCard({ data }: Props) {
    const [dateFormat, setDateFormat] = useState<'short' | 'full'>('short')
    function renderSwitch() {
        switch (data.activityType) {
            case 'ChangeStatus':
                return (
                    <ChangeStatusLog
                        fromStatusId={String(data.previousValue)}
                        toStatusId={String(data.currentValue)}
                    />
                )
            default:
                return <></>
        }
    }
    return (
        <div className="grid grid-cols-[48px_1fr] gap-4">
            <Image
                src={String(data?.modifiedBy?.avatar)}
                alt="user avatar"
                preview={false}
                rootClassName="!size-12 !rounded-full"
                className="!size-full !rounded-full"
            />
            <div>
                <p>
                    <span className="font-semibold">
                        {data?.modifiedBy?.name}
                    </span>{' '}
                    change the{' '}
                    <span className="font-semibold">{data?.fieldName}</span>
                </p>
                <button
                    onClick={() => {
                        if (dateFormat === 'full') {
                            setDateFormat('short')
                        } else {
                            setDateFormat('full')
                        }
                    }}
                    className="cursor-pointer"
                >
                    {dateFormat === 'full' ? (
                        <>
                            {dayjs(data.modifiedAt).format('LL')} at{' '}
                            {dayjs(data.modifiedAt).format('LT')}
                        </>
                    ) : (
                        <>{dayjs().to(dayjs(data.modifiedAt))}</>
                    )}
                </button>
                <div className="mt-4">{renderSwitch()}</div>
            </div>
        </div>
    )
}
