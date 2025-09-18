'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { Modal } from 'antd'

import { useFileStore } from '@/shared/components/FileManager/store/useFileStore'

type Props = {
    isOpen: boolean
    onClose: () => void
    deleteFiles: () => void
}

export default function DeleteModal({ isOpen, onClose, deleteFiles }: Props) {
    const { selectedFiles, activeFile } = useFileStore()
    return (
        <Modal
            title="Confirm Deletion"
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" variant="bordered" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="delete" color="danger" onClick={deleteFiles}>
                    Delete
                </Button>,
            ]}
        >
            <p>
                {selectedFiles.length > 0
                    ? `Are you sure you want to delete ${selectedFiles.length} selected item${selectedFiles.length !== 1 ? 's' : ''}?`
                    : `Are you sure you want to delete "${activeFile?.name}"?`}
            </p>
            <p className="text-gray-500 mt-2">This action cannot be undone.</p>
        </Modal>
    )
}
