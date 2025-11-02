'use client'

import React from 'react'

import {
    addToast,
    Button,
    Dropdown,
    DropdownItem,
    DropdownItemProps,
    DropdownMenu,
    DropdownSection,
    DropdownSectionProps,
    DropdownTrigger,
    useDisclosure,
} from '@heroui/react'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'
import {
    useDeleteJobMutation,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { useAddMemberModal } from '@/shared/actions'
import { ConfirmDeleteModal } from '@/shared/components'
import { RoleEnum } from '@/shared/enums'
import { Job } from '@/shared/interfaces'
import { EllipsisVerticalIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { accountingActions, adminActions, userActions } from '../dropdowns'
import { UpdateCostModal } from './modals'

export type ActionGroup = {
    key: React.Key | null | undefined
    groupTitle: string
    groupProps?: DropdownSectionProps
    children: {
        key: string | number
        title: string
        childProps?: Omit<DropdownItemProps, 'key'>
        icon: React.ReactNode
    }[]
}

type Props = {
    data: Job
}
export function TableActionDropdown({ data }: Props) {
    const t = useTranslations()

    const { openModal } = useAddMemberModal()
    const { userRole } = useProfile()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()

    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure({
        id: 'ConfirmDeleteModal',
    })

    const {
        isOpen: isOpenMAPModal,
        onOpen: onOpenMAPModal,
        onClose: onCloseMAPModal,
    } = useDisclosure({
        id: 'MarkAsPaidModal',
    })

    const {
        isOpen: isOpenUCostModal,
        onOpen: onOpenUCostModal,
        onClose: onCloseUCostModal,
    } = useDisclosure({
        id: 'UpdateCostModal',
    })

    const { mutateAsync: deleteJobMutation, isPending: isDeleting } =
        useDeleteJobMutation()
    const handleDelete = async () => {
        if (data?.id) {
            await deleteJobMutation(data?.id, {
                onSuccess: (res) => {
                    addToast({
                        title: t('successfully'),
                        description: t('deletedJob', {
                            jobNo: `#${res.data.result?.jobNo ?? data?.no}`,
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

    const handleOpenMarkAsPaidModal = () => {
        if (Boolean(data.isPaid)) {
            addToast({
                title: t('jobPaid', {
                    jobNo: `#${data.no}`,
                }),
                color: 'danger',
            })
        } else {
            onOpenMAPModal()
        }
    }

    const handleMarkAsPaid = async () => {
        if (data?.id) {
            await updateJobMutation(
                {
                    jobId: data?.id,
                    updateJobInput: {
                        isPaid: true,
                    },
                },
                {
                    onSuccess: (res) => {
                        addToast({
                            title: t('successfully'),
                            description: t('markJobAsPaidSuccess', {
                                jobNo: `#${res.data.result?.jobNo ?? data?.no}`,
                            }),
                            color: 'success',
                        })
                        queryClient.invalidateQueries({
                            queryKey: ['jobs'],
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
                }
            )
        }
    }

    const getActions: () => ActionGroup[] = () => {
        if (userRole === RoleEnum.ADMIN) {
            return adminActions(
                data.no,
                () => {
                    openModal(data.no)
                },
                onOpenModal,
                onOpenUCostModal,
                handleOpenMarkAsPaidModal
            )
        }
        if (userRole === RoleEnum.USER) {
            return userActions(data.no)
        }
        return accountingActions(data.no)
    }
    const actionsDropdown = getActions()

    return (
        <>
            <ConfirmDeleteModal
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onConfirm={handleDelete}
                title={t('deleteJob')}
                description={t('deleteJobDesc', {
                    jobNo: `#${data?.no}`,
                })}
                isLoading={isDeleting}
                style={{
                    zIndex: 9999999999,
                }}
            />
            <UpdateCostModal
                isOpen={isOpenUCostModal}
                onClose={onCloseUCostModal}
                data={data}
            />
            <ConfirmDeleteModal
                isOpen={isOpenMAPModal}
                onClose={onCloseMAPModal}
                onConfirm={handleMarkAsPaid}
                title={t('markJobAsPaid', {
                    jobNo: `#${data.no}`,
                })}
                description={t('markJobAsPaidDesc', {
                    jobNo: `#${data.no}`,
                })}
                confirmText={t('yes')}
                isLoading={isUpdating}
                style={{
                    zIndex: 9999999999,
                }}
                color="primary"
            />
            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Job menu actions">
                    {actionsDropdown.map((group) => {
                        return (
                            <DropdownSection
                                key={group.key}
                                title={group.groupTitle}
                                {...group.groupProps}
                            >
                                {group.children.map((item) => {
                                    return (
                                        <DropdownItem
                                            key={item.key}
                                            startContent={
                                                <div className="text-text-subdued">
                                                    {item.icon}
                                                </div>
                                            }
                                            {...item.childProps}
                                        >
                                            {item.title}
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownSection>
                        )
                    })}
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
