import { Project } from '@/validationSchemas/project.schema'

export const getProjects: (
    statusId?: string | null
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

export const getProjectByJobNo: (
    jobNo: string | null
) => Promise<Project> = async (jobNo) => {
    if (!jobNo) {
        return
    }
    const url = `/api/projects?jobNo=${jobNo}`
    const res = await fetch(url, {
        method: 'GET',
    })
    const data = await res.json()
    return data
}
