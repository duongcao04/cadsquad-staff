import React from 'react'

import { Button } from '@heroui/react'
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
    return (
        <Modal
            title={`Rename ${activeFile?.type === 'folder' ? 'Folder' : 'File'}`}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" variant="bordered" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="rename" color="primary" onClick={renameFile}>
                    Rename
                </Button>,
            ]}
        >
            <div className="py-4">
                {/* <Input
                    placeholder={
                        activeFile?.type === 'folder'
                            ? 'Folder Name'
                            : 'File Name'
                    }
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onPressEnter={renameFile}
                /> */}
            </div>
        </Modal>
    )
}
