import { FILE } from '@/shared/constants/appConstant'
import { FileItem } from '@/validationSchemas/file.schema'

export const ROOT_DIR = 'root'

export const DOCUMENTS_DIR = 'root' + FILE.SPLASH + 'Documents'
export const PROJECTS_CENTER_DIR = 'root' + FILE.SPLASH + 'Project Center'
export const TEAM_DIR = 'root' + FILE.SPLASH + 'Team'

export const getFileSystem: () => Promise<FileItem[]> = async () => {
    const res = await fetch('/api/fileSystems', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
