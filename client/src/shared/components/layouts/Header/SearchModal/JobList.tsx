import React from 'react'
import JobCard from './cards/JobCard'
import { Job } from '@/shared/interfaces/job.interface'

type Props = {
    data?: Job[]
    onClose: () => void
}

export default function JobList({ data, onClose }: Props) {
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
