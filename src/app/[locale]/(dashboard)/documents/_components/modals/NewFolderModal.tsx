'use client'

import React, { useState } from 'react'

import { Button, Input, addToast } from '@heroui/react'
import { Modal } from 'antd'

import { removeVietnameseTones } from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/useAuthStore'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { FileItem } from '@/validationSchemas/file.schema'

type Props = {
    isOpen: boolean
    onClose: () => void
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
}
export default function NewFolderModal({ isOpen, onClose, setFiles }: Props) {
    const { getSearchParam } = useSearchParam()
    const { authUser } = useAuthStore()

    const dirQuery = getSearchParam('directory') ?? 'Home'
    const currentPath = dirQuery.split('_')

    const [newFolderName, setNewFolderName] = useState('')

    // Create new folder
    const createNewFolder = async () => {
        if (newFolderName.trim() === '') return

        const newFolder: FileItem = {
            id: Date.now().toString(),
            name: newFolderName,
            slug: removeVietnameseTones(newFolderName).replaceAll(' ', '-'),
            visibleToUsers: [],
            createdById: authUser.id!,
            type: 'folder',
            size: '',
            items: 0,
            path: currentPath,
        }

        const res = await fetch('/api/fileSystems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFolder),
        })
        const data = await res.json()
        console.log(data)

        setFiles((prev) => [...prev, newFolder])
        setNewFolderName('')
        onClose()
        addToast({
            title: 'Folder created successfully!',
        })
    }

    console.log(currentPath)

    return (
        <Modal
            title="Create New Folder"
            open={isOpen}
            onCancel={onClose}
            footer={
                <div className="flex items-center justify-end gap-3">
                    <Button key="cancel" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        key="create"
                        color="primary"
                        onPress={createNewFolder}
                    >
                        Create Folder
                    </Button>
                </div>
            }
        >
            <div className="py-4">
                <Input
                    placeholder="Folder Name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    // onPressEnter={createNewFolder}
                />
            </div>
        </Modal>
    )
}
