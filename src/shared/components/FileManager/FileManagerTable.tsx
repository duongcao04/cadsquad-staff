'use client'

import React from 'react'

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react'
import { Checkbox, Table } from 'antd'
import {
    Download,
    EllipsisVerticalIcon,
    EyeIcon,
    FolderIcon,
    Move,
    Pencil,
    Trash,
} from 'lucide-react'

import { FileItem } from '@/validationSchemas/file.schema'

import { formatDate } from './actions/formatDate'
import { getFileIcon } from './actions/getFileIcon'
import { useFileStore } from './store/useFileStore'

type Props = {
    filteredFiles: FileItem[]
    handleFileAction: (action: string, file: FileItem) => void
    isLoading: boolean
}
export default function FileManagerTable({
    filteredFiles,
    handleFileAction,
    isLoading,
}: Props) {
    const { selectedFiles, setSelectedFiles } = useFileStore()

    // Handle file/folder selection
    const toggleSelection = (id: string) => {
        const newSelectedFiles = selectedFiles.includes(id)
            ? selectedFiles.filter((fileId) => fileId !== id)
            : [...selectedFiles, id]
        setSelectedFiles(newSelectedFiles)
    }
    // Handle select all
    const toggleSelectAll = () => {
        if (selectedFiles.length === filteredFiles.length) {
            setSelectedFiles([])
        } else {
            setSelectedFiles(filteredFiles.map((file) => file.id))
        }
    }

    // Table columns for list view
    const columns = [
        {
            title: (
                <Checkbox
                    checked={
                        selectedFiles.length === filteredFiles.length &&
                        filteredFiles.length > 0
                    }
                    onChange={toggleSelectAll}
                />
            ),
            dataIndex: 'select',
            key: 'select',
            width: 50,
            render: (_: unknown, record: FileItem) => (
                <Checkbox
                    checked={selectedFiles.includes(record.id)}
                    onChange={() => toggleSelection(record.id)}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: FileItem) => (
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleFileAction('open', record)}
                >
                    {getFileIcon(record.type, record.color!)}
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (text: string, record: FileItem) =>
                record.type === 'folder'
                    ? `${record.items} item${record.items !== 1 ? 's' : ''}`
                    : text,
        },
        {
            title: 'Modified',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: Date) => formatDate(date),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            render: (_: unknown, file: FileItem) => (
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                            <EllipsisVerticalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="File menu action">
                        <DropdownItem
                            key="open"
                            startContent={
                                file.type === 'folder' ? (
                                    <FolderIcon className="w-4 h-4" />
                                ) : (
                                    <EyeIcon className="w-4 h-4" />
                                )
                            }
                            onClick={() => handleFileAction('open', file)}
                        >
                            {file.type === 'folder' ? 'Open' : 'Preview'}
                        </DropdownItem>
                        <DropdownItem
                            key="download"
                            startContent={<Download className="w-4 h-4" />}
                            onClick={() => handleFileAction('download', file)}
                        >
                            {file.type === 'folder'
                                ? 'Download as ZIP'
                                : 'Download'}
                        </DropdownItem>
                        <DropdownItem
                            key="rename"
                            startContent={<Pencil className="w-4 h-4" />}
                            onClick={() => handleFileAction('rename', file)}
                        >
                            Rename
                        </DropdownItem>
                        <DropdownItem
                            key="move"
                            startContent={<Move className="w-4 h-4" />}
                            onClick={() => handleFileAction('move', file)}
                        >
                            Move
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            startContent={<Trash className="w-4 h-4" />}
                            onClick={() => handleFileAction('delete', file)}
                            color="danger"
                        >
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            ),
        },
    ]
    return (
        <Table
            loading={isLoading}
            columns={columns}
            dataSource={filteredFiles}
            rowKey="id"
            pagination={false}
            rowClassName={(record) =>
                selectedFiles.includes(record.id) ? 'bg-blue-50' : ''
            }
            locale={{
                emptyText: <div />,
            }}
        />
    )
}
