import React from 'react'
import { Job } from '@/shared/interfaces/_job.interface'
import { JobCard } from '../cards'

type Props = {
    jobs?: Job[]
    onClose: () => void
    loadingJobs?: boolean
}
export default function RecentlyTab({ jobs, onClose }: Props) {
    return (
        <div className="space-y-2">
            {jobs?.map((job) => {
                return <JobCard key={job.id} data={job} onClose={onClose} />
            })}
        </div>
    )
}
