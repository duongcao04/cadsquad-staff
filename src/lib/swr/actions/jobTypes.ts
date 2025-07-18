import { JobType } from '@/validationSchemas/project.schema'

export const getJobTypes: () => Promise<JobType[]> = async () => {
    const res = await fetch('/api/jobTypes', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
