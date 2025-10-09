import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import { JobCard } from './cards'

type Props = {
    data?: Job[]
    onClose: () => void
}

export function JobList({ data, onClose }: Props) {
    if (!data) {
        return <></>
    }
    return (
        <div className="space-y-2">
            {data?.map((job) => {
                return <JobCard key={job.id} data={job} onClose={onClose} />
            })}
        </div>
    )
}
