import React, { useState } from 'react'

import { Button, Input } from '@heroui/react'
import { Modal } from 'antd'

import { FileItem } from '@/validationSchemas/file.schema'

type Props = {
    isOpen: boolean
    onClose: () => void
    activeFile: FileItem | null
    renameFile: () => void
}

export default function RenameModal({
    isOpen,
    onClose,
    activeFile,
    renameFile,
}: Props) {
    const [newFileName, setNewFileName] = useState('')

    return (
        <Modal
            title={`Rename ${activeFile?.type === 'folder' ? 'Folder' : 'File'}`}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" variant="bordered" onPress={onClose}>
                    Cancel
                </Button>,
                <Button key="rename" color="primary" onPress={renameFile}>
                    Rename
                </Button>,
            ]}
        >
            <div className="py-4">
                <Input
                    placeholder={
                        activeFile?.type === 'folder'
                            ? 'Folder Name'
                            : 'File Name'
                    }
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                />
            </div>
        </Modal>
    )
}
