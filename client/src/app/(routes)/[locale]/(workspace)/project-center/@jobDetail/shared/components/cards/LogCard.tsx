'use client'

import { JobStatusChip, SwitchDateFormat } from '@/shared/components'
import { JobActivityLog } from '@/shared/interfaces'
import { useJobStatusDetail } from '@/shared/queries'
import { Image } from 'antd'
import { MoveRight } from 'lucide-react'

export function ChangeStatusLog({
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
            {fromStatus && <JobStatusChip data={fromStatus} />}
            <MoveRight />
            {toStatus && <JobStatusChip data={toStatus} />}
        </div>
    )
}

type Props = {
    data: JobActivityLog
}
export function LogCard({ data }: Props) {
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
                        {data?.modifiedBy?.displayName}
                    </span>{' '}
                    change the{' '}
                    <span className="font-semibold">{data?.fieldName}</span>
                </p>

                <SwitchDateFormat data={data.modifiedAt} />

                <div className="mt-4">{renderSwitch()}</div>
            </div>
        </div>
    )
}
