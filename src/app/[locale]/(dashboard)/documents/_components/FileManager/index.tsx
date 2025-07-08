'use client'

import React, { useState } from 'react'

import { Button, useDisclosure } from '@heroui/react'
import { Empty, message } from 'antd'
import {
    ArrowUp,
    BanIcon,
    BotIcon,
    FolderIcon,
    PlusIcon,
    TvIcon,
} from 'lucide-react'

import { PDFIcon } from '@/shared/components/icons/file-icons/PDFIcon'
import { WordIcon } from '@/shared/components/icons/file-icons/WordIcon'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { FileType } from '@/types/file.type'
import { FileItem } from '@/validationSchemas/file.schema'

import { sampleFiles } from '../../mockup/sampleDocuments'
import DeleteModal from '../modals/DeleteModal'
import MoveModal from '../modals/MoveModal'
import NewFolderModal from '../modals/NewFolderModal'
import RenameModal from '../modals/RenameModal'
import UploadModal from '../modals/UploadModal'
import BulkActionsToolbar from './BulkActionsToolbar'
import FileManagerHeader from './FileManagerHeader'
import FileManagerTable from './FileManagerTable'
import GridFileManager from './GridFileManager'

// Helper function to get file icon
export const getFileIcon = (type: FileType) => {
    const iconClass = 'h-5 w-5'
    switch (type) {
        case 'folder':
            return <FolderIcon className={`${iconClass} text-blue-500`} />
        case 'pdf':
            return <PDFIcon className={iconClass} />
        case 'image':
            return <BotIcon className={`${iconClass} text-green-500`} />
        case 'document':
            return <WordIcon className={iconClass} />
        case 'code':
            return <BanIcon className={`${iconClass} text-purple-500`} />
        default:
            return <TvIcon className={`${iconClass} text-gray-500`} />
    }
}

export default function FileManager() {
    const { getSearchParam, setSearchParams } = useSearchParam()

    const searchQuery = getSearchParam('search') ?? ''
    const dirQuery = getSearchParam('directory') ?? 'Home'
    const currentPath = dirQuery.split('_')

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

    const [files, setFiles] = useState<FileItem[]>(sampleFiles)
    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    // Modals state
    const [previewModalOpen, setPreviewModalOpen] = useState(false)
    const [activeFile, setActiveFile] = useState<FileItem | null>(null)

    // New folder name
    const [newFileName, setNewFileName] = useState('')

    // Filter files based on current path and search query
    const filteredFiles = files.filter((file) => {
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
            const newPath = [...folder.path, folder.slug]
            setSearchParams({ directory: newPath.join('_') })
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
        message.success('Item renamed successfully!')
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
                setViewMode={setViewMode}
                onOpenNewFolderModal={onOpenNewFolderModal}
                onOpenUploadModal={onOpenUploadModal}
            />

            {selectedFiles.length > 0 && (
                <BulkActionsToolbar
                    onOpenDeleteModal={onOpenDeleteModal}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                />
            )}

            {viewMode === 'list' && (
                <FileManagerTable
                    filteredFiles={filteredFiles}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    handleFileAction={handleFileAction}
                />
            )}

            {viewMode === 'grid' && (
                <GridFileManager
                    filteredFiles={filteredFiles}
                    selectedFiles={selectedFiles}
                />
            )}

            {filteredFiles.length === 0 && (
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
                activeFile={activeFile}
                renameFile={renameFile}
            />
            <DeleteModal
                isOpen={deleteModalOpen}
                onClose={onCloseDeleteModal}
                activeFile={activeFile}
                selectedFiles={selectedFiles}
                deleteFiles={deleteFiles}
            />
            <MoveModal
                isOpen={moveModalOpen}
                onClose={onCloseMoveModal}
                files={files}
                selectedFiles={selectedFiles}
                activeFile={activeFile}
            />
        </div>
    )
}
