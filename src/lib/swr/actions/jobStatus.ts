import { JobStatus, Project } from '@/validationSchemas/project.schema'

export const getJobStatuses: () => Promise<JobStatus[]> = async () => {
    const res = await fetch('/api/jobStatus', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}

export const updateJobStatus: (
    project: Project,
    newJobStatus: JobStatus
) => Promise<Project> = async (project, newJobStatus) => {
    const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ jobStatusId: newJobStatus.id }),
    })

    const data = await res.json()
    return data.data
}
