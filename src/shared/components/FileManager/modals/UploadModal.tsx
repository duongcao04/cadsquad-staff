import React, { useState } from 'react'

import { Button } from '@heroui/react'
import { Modal, Progress } from 'antd'
import { CloudUpload } from 'lucide-react'

import { ROOT_DIR } from '@/app/[locale]/(dashboard)/documents/actions'
import { useSearchParam } from '@/shared/hooks/useSearchParam'
import { FileItem } from '@/validationSchemas/file.schema'

type Props = {
    isOpen: boolean
    onClose: () => void
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
}
export default function UploadModal({ isOpen, onClose, setFiles }: Props) {
    const { getSearchParam } = useSearchParam()

    const dirQuery = getSearchParam('directory') ?? ROOT_DIR
    const currentPath = dirQuery.split('-')

    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadingFile, setUploadingFile] = useState('')

    // Simulate file upload
    const simulateUpload = (fileName: string) => {
        setUploadingFile(fileName)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)

                    // Add the new file to the list
                    const newFile: FileItem = {
                        id: Date.now().toString(),
                        name: fileName,
                        type: fileName.endsWith('.pdf')
                            ? 'pdf'
                            : fileName.endsWith('.jpg') ||
                                fileName.endsWith('.png')
                              ? 'image'
                              : fileName.endsWith('.docx') ||
                                  fileName.endsWith('.txt')
                                ? 'document'
                                : fileName.endsWith('.js') ||
                                    fileName.endsWith('.ts')
                                  ? 'code'
                                  : 'other',
                        size: '1.2 MB',
                        modified: Date.now(),
                        path: currentPath,
                    }

                    setFiles((prev) => [...prev, newFile])
                    onClose()
                    setUploadingFile('')
                    // message.success('File uploaded successfully!')
                    return 0
                }
                return prev + 10
            })
        }, 300)
    }

    return (
        <Modal
            title="Upload File"
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" variant="bordered" onPress={onClose}>
                    Cancel
                </Button>,
            ]}
        >
            <div
                className="p-12 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => {
                    if (!uploadingFile) {
                        simulateUpload('New Document.pdf')
                    }
                }}
            >
                <div className="flex flex-col items-center">
                    <CloudUpload className="w-10 h-10 mb-4 text-gray-400" />
                    <p className="mb-1 text-sm text-gray-600">
                        Drag and drop your file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                        Supports PDF, DOCX, JPG, PNG, and more
                    </p>
                </div>
            </div>

            {uploadingFile && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                            {uploadingFile}
                        </span>
                        <span className="text-sm text-gray-500">
                            {uploadProgress}%
                        </span>
                    </div>
                    <Progress percent={uploadProgress} size="small" />
                </div>
            )}
        </Modal>
    )
}
