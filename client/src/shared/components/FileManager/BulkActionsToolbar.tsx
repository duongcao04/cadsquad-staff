'use client'

import React from 'react'

import { Button } from '@heroui/react'
import { ArrowDown, Move, Trash } from 'lucide-react'

import { useFileStore } from './store/useFileStore'

type Props = {
    onOpenDeleteModal: () => void
}

export default function BulkActionsToolbar({ onOpenDeleteModal }: Props) {
    const { selectedFiles, setSelectedFiles } = useFileStore()

    const handleBulkAction = (action: string) => {
        switch (action) {
            case 'delete':
                onOpenDeleteModal()
                break
            case 'move':
                // setMoveModalOpen(true)
                break
            default:
                break
        }
    }

    return (
        <div className="bg-gray-50 p-3 flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
                <Button
                    variant="light"
                    size="sm"
                    // startContent={<XOctagonIcon className="h-4 w-4" />}
                    onClick={() => setSelectedFiles([])}
                >
                    Deselect
                </Button>
                <span className="text-sm text-gray-600">
                    {selectedFiles.length} item
                    {selectedFiles.length !== 1 ? 's' : ''} selected
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="bordered"
                    size="sm"
                    startContent={<ArrowDown className="h-4 w-4" />}
                    onClick={() => handleBulkAction('download')}
                >
                    Download
                </Button>
                <Button
                    variant="bordered"
                    size="sm"
                    startContent={<Move className="h-4 w-4" />}
                    onClick={() => handleBulkAction('move')}
                >
                    Move
                </Button>
                <Button
                    color="danger"
                    size="sm"
                    startContent={<Trash className="h-4 w-4" />}
                    onClick={() => handleBulkAction('delete')}
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}
