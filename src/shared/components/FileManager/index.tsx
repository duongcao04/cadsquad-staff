'use client'

import React, { useEffect, useState } from 'react'

import { Button, addToast, useDisclosure } from '@heroui/react'
import { Empty, message } from 'antd'
import { ArrowUp, PlusIcon } from 'lucide-react'
import useSWR from 'swr'

import {
    ROOT_DIR,
    getFileSystem,
} from '@/app/[locale]/(dashboard)/documents/actions'
// import { FILE_SYSTEM_API } from '@/lib/swr/api'
import { FILE } from '@/shared/constants/appConstant'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { FileItem } from '@/validationSchemas/file.schema'

import BulkActionsToolbar from './BulkActionsToolbar'
import FileManagerHeader from './FileManagerHeader'
import FileManagerTable from './FileManagerTable'
import GridFileManager from './GridFileManager'
import DeleteModal from './modals/DeleteModal'
import MoveModal from './modals/MoveModal'
import NewFolderModal from './modals/NewFolderModal'
import RenameModal from './modals/RenameModal'
import UploadModal from './modals/UploadModal'
import { useFileStore } from './store/useFileStore'

export type Props = {
    defaultDirectory?: string
    view?: 'list' | 'grid'
}
export default function FileManager({
    defaultDirectory = ROOT_DIR,
    view = 'list',
}: Props) {
    const { getSearchParam, setSearchParams } = useSearchParam()

    // Modals state
    const {
        isOpen: newFolderModalOpen,
        onClose: onCloseNewFolderModal,
        onOpen: onOpenNewFolderModal,
    } = useDisclosure({ id: 'NewFolderModal' })
    const {
        isOpen: moveModalOpen,
        onClose: onCloseMoveModal,
        onOpen: onOpenMoveModal,
    } = useDisclosure({ id: 'MoveModal' })
    const {
        isOpen: uploadModalOpen,
        onClose: onCloseUploadModal,
        onOpen: onOpenUploadModal,
    } = useDisclosure({ id: 'UploadModal' })
    const {
        isOpen: renameFolderModalOpen,
        onClose: onCloseRenameFolderModal,
        onOpen: onOpenRenameFolderModal,
    } = useDisclosure({ id: 'RenameFolderModal' })
    const {
        isOpen: deleteModalOpen,
        onClose: onCloseDeleteModal,
        onOpen: onOpenDeleteModal,
    } = useDisclosure({ id: 'DeleteModal' })

    const {
        currentPath,
        setCurrentPath,
        selectedFiles,
        setSelectedFiles,
        activeFile,
        setActiveFile,
    } = useFileStore()

    const searchQuery = getSearchParam('search') ?? ''
    const viewMode = getSearchParam('mode') ?? view

    useEffect(() => {
        setCurrentPath(defaultDirectory.split(FILE.SPLASH))
    }, [])

    const { data: fileSystem, isLoading } = useSWR(
        FILE_SYSTEM_API,
        getFileSystem
    )
    const [files, setFiles] = useState<FileItem[]>(fileSystem ?? [])

    const [previewModalOpen, setPreviewModalOpen] = useState(false)

    // New folder name
    const [newFileName, setNewFileName] = useState('')

    // Filter files based on current path and search query
    const filteredFiles = files?.filter((file) => {
        const pathMatch =
            JSON.stringify(file.path) === JSON.stringify(currentPath)
        const searchMatch =
            searchQuery === '' ||
            file.name.toLowerCase().includes(searchQuery.toLowerCase())
        return pathMatch && searchMatch
    })

    // Handle folder navigation
    const navigateToFolder = (folder: FileItem) => {
        if (folder.type === 'folder') {
            const newPath = [...folder.path, folder.name]
            setSearchParams({ directory: newPath.join(FILE.SPLASH) })
            setCurrentPath(newPath)
            setSelectedFiles([])
        }
    }

    // Handle file actions
    const handleFileAction = (action: string, file: FileItem) => {
        setActiveFile(file)

        switch (action) {
            case 'open':
                if (file.type === 'folder') {
                    navigateToFolder(file)
                } else {
                    setPreviewModalOpen(true)
                }
                break
            case 'rename':
                setNewFileName(file.name)
                onOpenRenameFolderModal()
                break
            case 'move':
                onOpenMoveModal()
                break
            case 'delete':
                onOpenDeleteModal()
                break
            case 'preview':
                setPreviewModalOpen(true)
                break
            default:
                break
        }
    }

    // Rename file/folder
    const renameFile = () => {
        if (!activeFile || newFileName.trim() === '') return

        setFiles((prev) =>
            prev.map((file) =>
                file.id === activeFile.id
                    ? { ...file, name: newFileName }
                    : file
            )
        )

        onOpenRenameFolderModal()
        setActiveFile(null)
        addToast({ title: 'Item renamed successfully!' })
    }

    // Delete file/folder
    const deleteFiles = () => {
        if (selectedFiles.length > 0) {
            setFiles((prev) =>
                prev.filter((file) => !selectedFiles.includes(file.id))
            )
            setSelectedFiles([])
            message.success(
                `${selectedFiles.length} item(s) deleted successfully!`
            )
        } else if (activeFile) {
            setFiles((prev) => prev.filter((file) => file.id !== activeFile.id))
            setActiveFile(null)
            message.success('Item deleted successfully!')
        }

        onCloseDeleteModal()
    }

    return (
        <div className="size-full">
            <FileManagerHeader
                onOpenNewFolderModal={onOpenNewFolderModal}
                onOpenUploadModal={onOpenUploadModal}
            />

            {selectedFiles.length > 0 && (
                <BulkActionsToolbar onOpenDeleteModal={onOpenDeleteModal} />
            )}

            {viewMode === 'list' && (
                <FileManagerTable
                    isLoading={isLoading}
                    filteredFiles={filteredFiles}
                    handleFileAction={handleFileAction}
                />
            )}

            {viewMode === 'grid' && (
                <GridFileManager filteredFiles={filteredFiles} />
            )}

            {!isLoading && filteredFiles.length === 0 && (
                <div className="p-12">
                    <Empty
                        description={
                            searchQuery
                                ? `No results found for "${searchQuery}"`
                                : 'This folder is empty'
                        }
                    >
                        <div className="flex items-center justify-center w-full gap-5 mt-5">
                            <Button
                                variant="bordered"
                                startContent={<PlusIcon className="w-4 h-4" />}
                                onClick={() => onOpenNewFolderModal()}
                            >
                                New Folder
                            </Button>
                            <Button
                                color="primary"
                                startContent={<ArrowUp className="w-4 h-4" />}
                                onClick={() => onOpenUploadModal()}
                            >
                                Upload File
                            </Button>
                        </div>
                    </Empty>
                </div>
            )}

            <UploadModal
                isOpen={uploadModalOpen}
                onClose={onCloseUploadModal}
                setFiles={setFiles}
            />
            <NewFolderModal
                isOpen={newFolderModalOpen}
                onClose={onCloseNewFolderModal}
                setFiles={setFiles}
            />
            <RenameModal
                isOpen={renameFolderModalOpen}
                onClose={onCloseRenameFolderModal}
                renameFile={renameFile}
            />
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={onCloseDeleteModal}
                deleteFiles={deleteFiles}
            />
            <MoveModal
                isOpen={moveModalOpen}
                onClose={onCloseMoveModal}
                files={files}
            />
        </div>
    )
}
