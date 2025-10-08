'use client'

import React, { useState } from 'react'

import { Button, Input, addToast } from '@heroui/react'
import { Modal } from 'antd'
import { FolderIcon, FolderPlus } from 'lucide-react'

import { useSearchParam } from '@/hooks/useSearchParam'
import { FileItem } from '..'
import { ROOT_DIR } from '../../../../app/(routes)/[locale]/(workspace)/documents/actions'

const FOLDER_COLORS = [
    '#1b1464',
    '#009cea',
    '#9a5c2f',
    '#4ca83c',
    '#faa700',
    '#f00000',
    '#f4007a',
    '#9f75d3',
    '#f4f479',
]

const DEFAULT_FOLDER_COLOR = FOLDER_COLORS[0]

type Props = {
    isOpen: boolean
    onClose: () => void
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
}
export default function NewFolderModal({ isOpen, onClose, setFiles }: Props) {
    const { getSearchParam } = useSearchParam()

    const dirQuery = getSearchParam('directory') ?? ROOT_DIR
    const currentPath = dirQuery.split('_')

    const [isLoading, setLoading] = useState(false)

    const [newFolderName, setNewFolderName] = useState('')
    const [folderColor, setFolderColor] = useState(DEFAULT_FOLDER_COLOR)

    // Create new folder
    const createNewFolder = async () => {
        try {
            setLoading(true)
            if (newFolderName.trim() === '') return

            const newFolder: FileItem = {
                id: Date.now().toString(),
                name: newFolderName,
                visibleToUsers: [],
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
            setFolderColor(DEFAULT_FOLDER_COLOR)
            onClose()
            addToast({
                title: 'Folder created successfully!',
            })
        } catch (error) {
            addToast({
                title: 'Folder created failed!',
                description: `${error}`,
            })
        } finally {
            setLoading(false)
        }
    }

    console.log(currentPath)

    return (
        <Modal
            title={
                <div className="flex items-center justify-start gap-3">
                    <FolderPlus className="text-secondary" />
                    <p>Create New Folder</p>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
            classNames={{
                mask: 'backdrop-blur-sm',
            }}
            footer={
                <div className="flex items-center justify-end gap-3">
                    <Button key="cancel" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        key="create"
                        color="primary"
                        onPress={createNewFolder}
                        isLoading={isLoading}
                    >
                        Create Folder
                    </Button>
                </div>
            }
        >
            <div className="py-4">
                <div className="flex items-center justify-center">
                    <FolderIcon
                        className="size-32"
                        style={{
                            color: folderColor,
                        }}
                    />
                </div>
                <div className="mt-10 space-y-6">
                    <div className="grid grid-cols-[0.25fr_1fr] gap-5 items-center">
                        <p className="relative text-right font-medium text-base pr-2 text-secondary">
                            Color
                            <span className="absolute top-0 right-0 text-danger!">
                                *
                            </span>
                        </p>
                        <div className="flex items-center justify-start gap-3 flex-wrap">
                            {FOLDER_COLORS.map((clr, index) => {
                                const isSelected = clr === folderColor

                                return (
                                    <div
                                        key={index}
                                        className="border-2 rounded-full grid place-items-center p-0.5"
                                        style={{
                                            borderColor: isSelected
                                                ? clr
                                                : 'transparent',
                                        }}
                                    >
                                        <Button
                                            isIconOnly
                                            variant="solid"
                                            className="rounded-full"
                                            size="sm"
                                            style={{ backgroundColor: clr }}
                                            onPress={() => setFolderColor(clr)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Input
                        isRequired
                        label="Folder Name"
                        placeholder="e.g. Example Folder"
                        color="secondary"
                        variant="faded"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        labelPlacement="outside-left"
                        classNames={{
                            base: 'grid grid-cols-[0.25fr_1fr] gap-3',
                            inputWrapper: 'w-full',
                            label: 'text-right font-medium text-base',
                        }}
                        // onPressEnter={createNewFolder}
                    />
                </div>
            </div>
        </Modal>
    )
}
