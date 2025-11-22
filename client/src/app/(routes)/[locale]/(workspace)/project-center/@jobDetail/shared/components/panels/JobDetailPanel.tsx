'use client'

import { Job } from '@/shared/interfaces'
import { Assignee, Attachments, ClientName } from '../data-fields'

type Props = {
    isLoading?: boolean
    data: Job
}
export function JobDetailPanel({ isLoading = false, data }: Props) {
    return (
        <div className="w-full space-y-2.5">
            <ClientName isLoading={isLoading} data={data} />
            <hr className="text-text-muted" />
            <Assignee isLoading={isLoading} data={data} />
            <hr className="text-text-muted" />
            <Attachments isLoading={isLoading} data={data} />
        </div>
    )
}
