import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import JobCard from '../cards/JobCard'

type Props = {
    jobs?: Job[]
    onClose: () => void
    loadingJobs?: boolean
}
export default function RecentlyTab({
    jobs,
    loadingJobs = false,
    onClose,
}: Props) {
    return (
        <div className="space-y-2">
            {jobs?.map((job) => {
                return <JobCard key={job.id} data={job} onClose={onClose} />
            })}
        </div>
    )
}
