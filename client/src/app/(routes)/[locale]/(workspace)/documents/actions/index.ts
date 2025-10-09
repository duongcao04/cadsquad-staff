import { FileItem } from '@/shared/components/FileManager'

export const ROOT_DIR = 'root'

export const DOCUMENTS_DIR = 'root' + '/' + 'Documents'
export const PROJECTS_CENTER_DIR = 'root' + '/' + 'Project Center'
export const TEAM_DIR = 'root' + '/' + 'Team'

export const getFileSystem: () => Promise<FileItem[]> = async () => {
    const res = await fetch('/api/fileSystems', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
