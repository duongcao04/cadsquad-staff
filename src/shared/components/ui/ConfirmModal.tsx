'use client'

import { ReactNode } from 'react'

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@heroui/react'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title?: string
    message?: string | ReactNode
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'success' | 'info'
    isLoading?: boolean
    size?:
        | 'xs'
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | 'full'
    backdrop?: 'opaque' | 'blur' | 'transparent'
    isDismissable?: boolean
    hideCloseButton?: boolean
    placement?:
        | 'auto'
        | 'top'
        | 'top-center'
        | 'center'
        | 'bottom'
        | 'bottom-center'
}

export function useConfirmModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return {
        isOpen,
        onOpen,
        onClose,
        openConfirm: onOpen,
        closeConfirm: onClose,
    }
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
    size = 'md',
    backdrop = 'blur',
    isDismissable = true,
    hideCloseButton = false,
    placement = 'center',
}: ConfirmModalProps) {
    // Variant styles
    const variantConfig = {
        danger: {
            icon: <XCircle className="w-6 h-6 text-danger" />,
            confirmColor: 'danger' as const,
            headerColor: 'text-danger',
            iconBg: 'bg-danger-50 dark:bg-danger-900/20',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-warning" />,
            confirmColor: 'warning' as const,
            headerColor: 'text-warning',
            iconBg: 'bg-warning-50 dark:bg-warning-900/20',
        },
        success: {
            icon: <CheckCircle className="w-6 h-6 text-success" />,
            confirmColor: 'success' as const,
            headerColor: 'text-success',
            iconBg: 'bg-success-50 dark:bg-success-900/20',
        },
        info: {
            icon: <Info className="w-6 h-6 text-primary" />,
            confirmColor: 'primary' as const,
            headerColor: 'text-primary',
            iconBg: 'bg-primary-50 dark:bg-primary-900/20',
        },
    }

    const config = variantConfig[variant]

    const handleConfirm = async () => {
        try {
            await onConfirm()
            onClose()
        } catch (error) {
            console.error('Confirm action failed:', error)
            // Keep modal open on error
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            backdrop={backdrop}
            isDismissable={isDismissable && !isLoading}
            hideCloseButton={hideCloseButton}
            placement={placement}
            classNames={{
                backdrop: 'bg-black/60 backdrop-blur-xs',
                base: 'border-[1px] border-default-200 dark:border-default-100',
                header: 'border-b-[1px] border-default-200 dark:border-default-100',
                body: 'py-6',
                footer: 'border-t-[1px] border-default-200 dark:border-default-100',
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${config.iconBg}`}>
                            {config.icon}
                        </div>
                        <h3
                            className={`text-lg font-semibold ${config.headerColor}`}
                        >
                            {title || 'Confirm Action'}
                        </h3>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="text-default-600 dark:text-default-400">
                        {message ||
                            'Are you sure you want to proceed with this action?'}
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button
                        color="default"
                        variant="light"
                        onPress={onClose}
                        disabled={isLoading}
                        className="font-medium"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        color={config.confirmColor}
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        className="font-medium"
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isLoading = false,
    ...props
}: Omit<ConfirmModalProps, 'variant' | 'title' | 'confirmText'> & {
    itemName?: string
}) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            variant="danger"
            title="Delete Confirmation"
            message={
                <div className="space-y-2">
                    <p>
                        Are you sure you want to delete{' '}
                        {itemName ? `"${itemName}"` : 'this item'}?
                    </p>
                    <p className="text-sm text-default-500">
                        This action cannot be undone.
                    </p>
                </div>
            }
            confirmText="Delete"
            isLoading={isLoading}
            {...props}
        />
    )
}
export function LogoutConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    ...props
}: Omit<ConfirmModalProps, 'variant' | 'title' | 'message' | 'confirmText'>) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            variant="warning"
            title="Logout Confirmation"
            message="Are you sure you want to logout? Any unsaved changes will be lost."
            confirmText="Logout"
            isLoading={isLoading}
            {...props}
        />
    )
}

export function SaveConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    ...props
}: Omit<ConfirmModalProps, 'variant' | 'title' | 'message' | 'confirmText'>) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            variant="success"
            title="Save Changes"
            message="Do you want to save the changes you made?"
            confirmText="Save"
            isLoading={isLoading}
            {...props}
        />
    )
}
