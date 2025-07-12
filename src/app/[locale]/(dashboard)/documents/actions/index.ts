import { FileItem } from '@/validationSchemas/file.schema'

export const ROOT_DIR = 'root'

export const documentsDir = ['root', 'documents']
export const projectsCenterDir = ['root', 'projectCenter']
export const teamDir = ['root', 'team']

export const getFileSystem: () => Promise<FileItem[]> = async () => {
    const res = await fetch('/api/fileSystems', {
        method: 'GET',
    })
    const data = await res.json()
    return data.data
}
