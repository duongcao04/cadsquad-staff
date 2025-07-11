import React from 'react'

import { Input, Kbd } from '@heroui/react'
import { Modal } from 'antd'
import { SearchIcon } from 'lucide-react'
import { useKeyboardShortcuts } from 'use-keyboard-shortcuts'

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
    useKeyboardShortcuts([
        {
            keys: ['escape'],
            onEvent: () => onClose(),
        },
    ])

    return (
        <Modal
            closable={false}
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            footer={false}
            classNames={{
                content: 'p-0!',
            }}
            width={700}
            centered
        >
            <div className="border-b">
                <Input
                    placeholder="Search"
                    size="lg"
                    startContent={<SearchIcon />}
                    endContent={<Kbd>ESC</Kbd>}
                />
            </div>
        </Modal>
    )
}
