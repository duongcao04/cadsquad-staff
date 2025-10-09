'use client'

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'
import React from 'react'

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    children?: React.ReactNode
    isLoading?: boolean
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete User',
    description = 'Are you sure you want to delete this user? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isLoading = false,
    children,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            hideCloseButton
        >
            <ModalContent className="p-2">
                <ModalHeader className="text-danger font-semibold text-lg">
                    {title}
                </ModalHeader>
                <ModalBody>
                    {children ? (
                        children
                    ) : (
                        <p className="text-sm text-default-600">
                            {description}
                        </p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        color="danger"
                        isLoading={isLoading}
                        onPress={() => {
                            onConfirm()
                            if (!isLoading) {
                                onClose()
                            }
                        }}
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
