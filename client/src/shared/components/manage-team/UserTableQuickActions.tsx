'use client'

import { useRouter } from '@/i18n/navigation'
import { ApiError } from '@/lib/axios'
import { useDeleteUser } from '@/lib/queries'
import { ConfirmDeleteModal } from '@/shared/components'
import { addToast, Button, useDisclosure } from '@heroui/react'
import {
    EllipsisVerticalIcon,
    Mail,
    RotateCcw,
    Send,
    Trash2,
    UserPen,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TUser } from '../../types'
import ResetPasswordModal from '../modals/ResetPasswordModal'
import UpdateUsernameModal from '../modals/UpdateUsernameModal'
import {
    HeroDropdown,
    HeroDropdownItem,
    HeroDropdownMenu,
    HeroDropdownSection,
    HeroDropdownTrigger,
} from '../ui/hero-dropdown'

type Props = {
    data: TUser
}
export function UserTableQuickActions({ data }: Props) {
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
    const {
        isOpen: isOpenUpdateUsernameModal,
        onOpen: onOpenUpdateUsernameModal,
        onClose: onCloseUpdateUsernameModal,
    } = useDisclosure({
        id: 'UpdateUsernameModal',
    })
    const router = useRouter()

    const { mutateAsync: deleteUserMutation, isPending: isDeleting } =
        useDeleteUser()

    const t = useTranslations()

    const handleEmailUser = () => router.push(`mailto:${data?.email}`)

    const handleDeleteUser = async () => {
        if (data?.id) {
            await deleteUserMutation(data?.id, {
                onSuccess: (res) => {
                    addToast({
                        title: t('successfully'),
                        description: t('deletedUser', {
                            username: `@${res.data.result?.username}`,
                        }),
                        color: 'success',
                    })
                    onCloseModal()
                },
                onError(error) {
                    const err = error as unknown as ApiError
                    addToast({
                        title: t('failed'),
                        description: err.message,
                        color: 'danger',
                    })
                },
            })
        }
    }

    return (
        <>
            <ConfirmDeleteModal
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onConfirm={handleDeleteUser}
                title={t('deleteUser')}
                description={t('deleteUserDesc', {
                    username: data?.username ? `@${data?.username}` : '',
                })}
                isLoading={isDeleting}
            />
            <ResetPasswordModal
                isOpen={isOpenResetPWModal}
                onClose={onCloseResetPWModal}
                data={data}
            />
            <UpdateUsernameModal
                isOpen={isOpenUpdateUsernameModal}
                onClose={onCloseUpdateUsernameModal}
                data={data}
            />
            <HeroDropdown>
                <HeroDropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </HeroDropdownTrigger>
                <HeroDropdownMenu
                    aria-label="Team menu actions"
                    disabledKeys={['sendNotification']}
                >
                    <HeroDropdownSection showDivider title={t('contact')}>
                        <HeroDropdownItem
                            key="emailUser"
                            onPress={handleEmailUser}
                            startContent={
                                <Mail size={14} className="text-defaultp5" />
                            }
                        >
                            {t('emailUser')}
                        </HeroDropdownItem>
                    </HeroDropdownSection>
                    <HeroDropdownSection showDivider title={t('alert')}>
                        <HeroDropdownItem
                            key="sendNotification"
                            startContent={
                                <Send size={14} className="text-defaultp5" />
                            }
                        >
                            {t('sendNotification')}
                        </HeroDropdownItem>
                    </HeroDropdownSection>
                    <HeroDropdownSection title={t('updateUser')} showDivider>
                        <HeroDropdownItem
                            key="resetPassword"
                            startContent={
                                <RotateCcw
                                    size={14}
                                    className="text-defaultp5"
                                />
                            }
                            onPress={onOpenResetPWModal}
                        >
                            {t('resetPassword')}
                        </HeroDropdownItem>
                        <HeroDropdownItem
                            key="renameUser"
                            startContent={
                                <UserPen size={14} className="text-defaultp5" />
                            }
                            onPress={onOpenUpdateUsernameModal}
                        >
                            {t('renameUser')}
                        </HeroDropdownItem>
                    </HeroDropdownSection>
                    <HeroDropdownSection>
                        <HeroDropdownItem
                            key="delete"
                            color="danger"
                            startContent={
                                <Trash2 size={14} className="text-defaultp5" />
                            }
                            onPress={onOpenModal}
                        >
                            {t('deleteUser')}
                        </HeroDropdownItem>
                    </HeroDropdownSection>
                </HeroDropdownMenu>
            </HeroDropdown>
        </>
    )
}
