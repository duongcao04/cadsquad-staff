import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    useDisclosure,
} from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import {
    EllipsisVerticalIcon,
    Mail,
    RotateCcw,
    Send,
    Trash2,
    UserPen,
} from 'lucide-react'

import { useDeleteUser } from '@/lib/queries'
import { ConfirmDeleteModal } from '@/shared/components'
import type { TUser } from '@/shared/types'

import ResetPasswordModal from '../modals/ResetPasswordModal'

type UserTableQuickActionsProps = {
    data: TUser
}
export function UserTableQuickActions({ data }: UserTableQuickActionsProps) {
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure({
        id: 'ConfirmDeleteModal',
    })
    const {
        isOpen: isOpenResetPWModal,
        onOpen: onOpenResetPWModal,
        onClose: onCloseResetPWModal,
    } = useDisclosure({
        id: 'ResetPasswordModal',
    })
    const router = useRouter()

    const { mutateAsync: deleteUserMutation, isPending: isDeleting } =
        useDeleteUser()

    const handleEmailUser = () =>
        router.navigate({
            href: `mailto:${data?.email}`,
        })

    const handleDeleteUser = async () => {
        if (data?.id) {
            await deleteUserMutation(data?.id, {
                onSuccess: () => {
                    addToast({
                        title: 'Delete user successfully',
                        color: 'success',
                    })
                    onCloseModal()
                },
            })
        }
    }

    return (
        <>
            {isOpenModal && (
                <ConfirmDeleteModal
                    isOpen={isOpenModal}
                    onClose={onCloseModal}
                    onConfirm={handleDeleteUser}
                    title="Delete user"
                    description={`Are you sure delete user @${data?.username} ?`}
                    isLoading={isDeleting}
                />
            )}
            {isOpenResetPWModal && (
                <ResetPasswordModal
                    isOpen={isOpenResetPWModal}
                    onClose={onCloseResetPWModal}
                    data={data}
                />
            )}
            {/* {isOpenUpdateUsernameModal && (
                <UpdateUsernameModal
                    isOpen={isOpenUpdateUsernameModal}
                    onClose={onCloseUpdateUsernameModal}
                    data={data}
                />
            )} */}

            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Team menu actions"
                    disabledKeys={['sendNotification']}
                >
                    <DropdownSection showDivider title={'Contact'}>
                        <DropdownItem
                            key="emailUser"
                            onPress={handleEmailUser}
                            startContent={
                                <Mail size={14} className="text-text-8" />
                            }
                        >
                            Email user
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection showDivider title="Alert">
                        <DropdownItem
                            key="sendNotification"
                            startContent={
                                <Send size={14} className="text-text-8" />
                            }
                        >
                            Send notification
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Update user" showDivider>
                        <DropdownItem
                            key="resetPassword"
                            startContent={
                                <RotateCcw size={14} className="text-text-8" />
                            }
                            onPress={onOpenResetPWModal}
                        >
                            Reset password
                        </DropdownItem>
                        <DropdownItem
                            key="renameUser"
                            startContent={
                                <UserPen size={14} className="text-text-8" />
                            }
                            // onPress={onOpenUpdateUsernameModal}
                        >
                            Rename user
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection>
                        <DropdownItem
                            key="delete"
                            color="danger"
                            startContent={
                                <Trash2 size={14} className="text-text-8" />
                            }
                            onPress={onOpenModal}
                        >
                            Delete user
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
