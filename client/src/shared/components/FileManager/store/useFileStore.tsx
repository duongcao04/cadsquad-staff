import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import { FileItem } from '@/shared/components/FileManager'

type FileState = {
    activeFile: FileItem | null
    selectedFiles: string[]
    currentPath: string[]
}

type FileActions = {
    setActiveFile: (activeFile: FileItem | null) => void
    setSelectedFiles: (selectedFiles: string[]) => void
    setCurrentPath: (newPath: string[]) => void
}

export const useFileStore = create(
    combine<FileState, FileActions>(
        {
            activeFile: null,
            selectedFiles: [],
            currentPath: [],
        },
        (set) => ({
            setActiveFile: (activeFile) => {
                set(() => ({ activeFile }))
            },
            setSelectedFiles: (selectedFiles: string[]) => {
                set(() => ({ selectedFiles }))
            },
            setCurrentPath: (newPath: string[]) => {
                set(() => ({ currentPath: newPath }))
            },
        })
    )
)
