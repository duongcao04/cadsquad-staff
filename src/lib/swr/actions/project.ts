import { NewProject, Project } from '@/validationSchemas/project.schema'

import { PROJECT_API } from '../api'

export const getProjects: (
    statusId?: string | null
) => Promise<Project[]> = async (statusId) => {
    let url = PROJECT_API
    if (statusId) {
        url += `?status=${statusId}`
    }
    const res = await fetch(url, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data.records
}

export const getProjectByJobNo: (
    jobNo: string | null
) => Promise<Project> = async (jobNo) => {
    if (!jobNo) {
        return
    }
    const url = `${PROJECT_API}?jobNo=${jobNo}`
    const res = await fetch(url, {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}

export const getProjectByTab: (tab?: string) => Promise<{
    projects: Project[]
    count: Record<
        | 'priority'
        | 'active'
        | 'late'
        | 'delivered'
        | 'completed'
        | 'cancelled',
        number
    >
}> = async (tab = 'priority') => {
    const url = `${PROJECT_API}?tab=${tab}`
    const res = await fetch(url, {
        method: 'GET',
    })
    const data = await res.json()
    const { records: projects, count } = data.data
    return { projects, count }
}

export const createProject: (
    newProject: NewProject
) => Promise<Project> = async (newProject) => {
    const res = await fetch(PROJECT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
    })
    const data = await res.json()
    return data
}

export const deleteProject: (id: string | number) => Promise<Project> = async (
    id
) => {
    const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
    })
    const data = await res.json()
    return data.data
}
