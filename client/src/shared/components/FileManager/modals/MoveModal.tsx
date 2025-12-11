'use client'

import React from 'react'

import { FolderOutlined } from '@ant-design/icons'
import { Button, List, Modal, Typography } from 'antd'

import { useFileStore } from '@/shared/components/FileManager/store/useFileStore'
import { FileItem } from '@/shared/components/FileManager'

const { Title, Text } = Typography

type Props = {
    isOpen: boolean
    onClose: () => void
    files: FileItem[]
}

export default function MoveModal({ isOpen, onClose, files }: Props) {
    const { selectedFiles, activeFile } = useFileStore()

    const handleMove = (destinationPath?: string) => {
        // Move logic would go here
        console.log('Moving to:', destinationPath || 'Home')
        onClose()
    }

    const folderItems = [
        {
            id: 'home',
            name: 'Home',
            type: 'folder',
            onClick: () => handleMove('/'),
        },
        ...files
            .filter((file) => file.type === 'folder')
            .map((folder) => ({
                id: folder.id,
                name: folder.name,
                type: 'folder',
                // onClick: () => handleMove(folder.path || folder.name),
            })),
    ]

    return (
        <Modal
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Move {selectedFiles.length > 0 ? 'Items' : activeFile?.name}
                </Title>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="move" type="primary" onClick={() => handleMove()}>
                    Move Here
                </Button>,
            ]}
            width={500}
        >
            <Text
                type="secondary"
                style={{ display: 'block', marginBottom: 16 }}
            >
                Select a destination folder.
            </Text>

            <List
                size="small"
                style={{
                    maxHeight: 200,
                    overflow: 'auto',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    padding: 8,
                }}
                dataSource={folderItems}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: '8px 12px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            border: 'none',
                        }}
                        className="hover:bg-gray-50"
                        // onClick={item.onClick}
                    >
                        <List.Item.Meta
                            avatar={
                                <FolderOutlined
                                    style={{ color: '#1890ff', fontSize: 16 }}
                                />
                            }
                            title={item.name}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    )
}
