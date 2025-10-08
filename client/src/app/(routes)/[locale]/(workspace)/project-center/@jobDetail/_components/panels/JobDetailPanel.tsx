'use client'

import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import ClientName from '../data-fields/ClientName'
import Assignee from '../data-fields/Assignee'
import Attachments from '../data-fields/Attachments'

type Props = {
    isLoading?: boolean
    data: Job
}
export default function JobDetailPanel({ isLoading = false, data }: Props) {
    return (
        <div className="w-full space-y-2.5">
            <ClientName isLoading={isLoading} data={data} />
            <hr className="text-text3" />
            <Assignee isLoading={isLoading} data={data} />
            <hr className="text-text3" />
            <Attachments isLoading={isLoading} data={data} />
        </div>
    )
}
