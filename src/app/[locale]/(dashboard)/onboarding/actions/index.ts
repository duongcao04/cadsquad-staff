import { JobStatus, Project } from '@/validationSchemas/project.schema'

export const getJobStatuses: () => Promise<JobStatus[]> = async () => {
    const res = await fetch('/api/jobStatus', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}

export const getProjects: (
    statusId: string | null
) => Promise<Project[]> = async (statusId) => {
    let url = '/api/projects'
    if (statusId) {
        url += `?status=${statusId}`
    }
    const res = await fetch(url, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
