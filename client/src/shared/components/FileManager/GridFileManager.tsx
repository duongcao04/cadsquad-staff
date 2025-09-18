import React from 'react'

import { Button, Checkbox } from '@heroui/react'
import { Dropdown } from 'antd'
import { EllipsisVerticalIcon } from 'lucide-react'

import { FileItem } from '@/validationSchemas/file.schema'

import { getFileIcon } from './actions/getFileIcon'
import { useFileStore } from './store/useFileStore'

type Props = {
    filteredFiles: FileItem[]
}
export default function GridFileManager({ filteredFiles }: Props) {
    const { selectedFiles } = useFileStore()

    return (
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredFiles.map((file) => (
                <div
                    key={file.id}
                    className={`relative group rounded-lg border bg-white p-3 transition-all hover:shadow-md cursor-pointer ${
                        selectedFiles.includes(file.id)
                            ? 'ring-2 ring-blue-500'
                            : ''
                    }`}
                >
                    <div className="absolute top-2 right-2">
                        <Checkbox
                            checked={selectedFiles.includes(file.id)}
                            // onChange={() => toggleSelection(file.id)}
                        />
                    </div>

                    <div
                        className="flex flex-col items-center p-2"
                        // onClick={() => handleFileAction('open', file)}
                    >
                        <div className="mb-2 text-4xl">
                            {getFileIcon(file.type, file.color!)}
                        </div>
                        <div className="text-center">
                            <p className="font-medium truncate w-full max-w-[120px] text-sm">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {file.type === 'folder'
                                    ? `${file.items} item${file.items !== 1 ? 's' : ''}`
                                    : file.size}
                            </p>
                        </div>
                    </div>

                    <div className="absolute transition-opacity opacity-0 bottom-2 right-2 group-hover:opacity-100">
                        <Dropdown
                            // overlay={createFileMenu(file)}
                            trigger={['click']}
                        >
                            <Button isIconOnly size="sm" variant="light">
                                <EllipsisVerticalIcon className="w-4 h-4" />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            ))}
        </div>
    )
}
