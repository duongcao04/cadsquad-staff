import {
    HeroButton,
    HeroInput,
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalFooter,
    HeroModalHeader,
} from '@/shared/components'
import { TUser } from '@/shared/types'
import { Chip } from '@heroui/react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeleteUserModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => Promise<void> | void
    user: TUser
}

export const DeleteUserPermanentlyModal = ({
    isOpen,
    onClose,
    onConfirm,
    user,
}: DeleteUserModalProps) => {
    const [confirmText, setConfirmText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setConfirmText('')
            setIsLoading(false)
        }
    }, [isOpen])

    const handleDelete = async () => {
        if (confirmText !== user?.username) return

        setIsLoading(true)
        try {
            await onConfirm()
            onClose()
        } catch (error) {
            console.error('Delete failed', error)
            setIsLoading(false)
        }
    }

    const isMatch = confirmText === user?.username

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            size="md"
            hideCloseButton={isLoading}
        >
            <HeroModalContent>
                {(close) => (
                    <>
                        <HeroModalHeader className="flex flex-col gap-1 bg-danger-50/50 dark:bg-danger-950/50 border-b border-red-100 dark:border-red-900/40">
                            <div className="flex items-center gap-2 text-danger">
                                <div className="p-2 bg-red-100 dark:border-red-900/40 rounded-full">
                                    <AlertTriangle size={20} />
                                </div>
                                <span className="text-lg font-bold">
                                    Delete User Permanently?
                                </span>
                            </div>
                        </HeroModalHeader>

                        <HeroModalBody className="py-6">
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-sm text-red-800">
                                    <strong>Warning:</strong> This action is{' '}
                                    <u>irreversible</u>.
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>
                                            The user{' '}
                                            <strong>@{user?.username}</strong>{' '}
                                            will be removed.
                                        </li>
                                        <li>
                                            All login sessions will be
                                            terminated.
                                        </li>
                                        <li>
                                            Historical logs (like created jobs)
                                            may be anonymized.
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-default mb-8">
                                        To confirm, type{' '}
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="font-mono text-xs"
                                        >
                                            {user?.username}
                                        </Chip>{' '}
                                        below:
                                    </label>
                                    <HeroInput
                                        placeholder={user?.username}
                                        variant="bordered"
                                        color={
                                            confirmText && !isMatch
                                                ? 'danger'
                                                : 'default'
                                        }
                                        labelPlacement="outside-top"
                                        value={confirmText}
                                        onValueChange={setConfirmText}
                                        isDisabled={isLoading}
                                        errorMessage={
                                            confirmText && !isMatch
                                                ? 'Username does not match'
                                                : ''
                                        }
                                    />
                                </div>
                            </div>
                        </HeroModalBody>

                        <HeroModalFooter className="bg-background-muted/2 border-t border-border-default">
                            <HeroButton
                                variant="light"
                                onPress={close}
                                isDisabled={isLoading}
                            >
                                Cancel
                            </HeroButton>
                            <HeroButton
                                color="danger"
                                variant="shadow"
                                isLoading={isLoading}
                                isDisabled={!isMatch}
                                onPress={handleDelete}
                                startContent={
                                    !isLoading && <Trash2 size={18} />
                                }
                                className="font-semibold"
                            >
                                {isLoading
                                    ? 'Deleting...'
                                    : 'Permanently Delete'}
                            </HeroButton>
                        </HeroModalFooter>
                    </>
                )}
            </HeroModalContent>
        </HeroModal>
    )
}
