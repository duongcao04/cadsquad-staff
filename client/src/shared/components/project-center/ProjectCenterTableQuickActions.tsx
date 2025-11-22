'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'
import {
    useDeleteJobMutation,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { ConfirmDeleteModal } from '@/shared/components'
import { TJob } from '@/shared/types'
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
import {
    CircleCheck,
    CircleDollarSign,
    EllipsisVerticalIcon,
    PinIcon,
    SquareArrowOutUpRight,
    Trash,
    UserPlus,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import AssignMemberModal from './AssignMemberModal'
import UpdateCostModal from './UpdateCostModal'

type ProjectCenterTableQuickActionsProps = {
    data: TJob
}
export function ProjectCenterTableQuickActions({
    data,
}: ProjectCenterTableQuickActionsProps) {
    const locale = useLocale()
    const t = useTranslations()

    const { isAdmin, isAccounting } = useProfile()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const { mutateAsync: deleteJobMutation, isPending: isDeleting } =
        useDeleteJobMutation()

    const {
        isOpen: isOpenAssignModal,
        onOpen: onOpenAssignModal,
        onClose: onCloseAssignModal,
    } = useDisclosure({
        id: 'AssignMemberModal',
    })
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

    const onDeleteJob = async () => {
        await deleteJobMutation(data?.id, {
            onSuccess: () => {
                onCloseModal()
            },
        })
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

    return (
        <>
            <ConfirmDeleteModal
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onConfirm={onDeleteJob}
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

            <AssignMemberModal
                isOpen={isOpenAssignModal}
                onClose={onCloseAssignModal}
                jobNo={data.no}
            />

            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Job menu actions">
                    <DropdownSection key="feature_actions" title="View">
                        <DropdownItem
                            key="openInNewTab"
                            startContent={
                                <SquareArrowOutUpRight
                                    className="text-text-subdued"
                                    size={14}
                                />
                            }
                            onPress={() =>
                                window.open(
                                    `/${locale}/jobs/${data.no}`,
                                    '_blank'
                                )
                            }
                        >
                            Open in new tab
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection key="job_actions" title="Job">
                        <DropdownItem
                            key="pin"
                            startContent={
                                <PinIcon
                                    size={14}
                                    className="text-text-subdued rotate-45"
                                />
                            }
                            onPress={() =>
                                alert('Tính năng đang được phát triển')
                            }
                        >
                            Pin Job
                        </DropdownItem>
                        <DropdownItem
                            key="assignReassign"
                            style={{
                                display: isAdmin ? 'flex' : 'none',
                            }}
                            startContent={
                                <UserPlus
                                    size={14}
                                    className="text-text-subdued"
                                />
                            }
                            onPress={() => onOpenAssignModal()}
                        >
                            Assign / Reassign
                        </DropdownItem>
                        <DropdownItem
                            key="deleteJob"
                            style={{
                                display: isAdmin ? 'flex' : 'none',
                            }}
                            startContent={
                                <Trash
                                    size={14}
                                    className="text-text-subdued"
                                />
                            }
                            onPress={() => onOpenModal()}
                        >
                            Delete
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection
                        key="payment_actions"
                        title="Payment"
                        style={{
                            display: isAdmin || isAccounting ? 'block' : 'none',
                        }}
                    >
                        <DropdownItem
                            key="updateCost"
                            startContent={
                                <CircleDollarSign
                                    size={14}
                                    className="text-text-subdued"
                                />
                            }
                            onPress={() => onOpenUCostModal()}
                        >
                            Update Cost
                        </DropdownItem>
                        <DropdownItem
                            key="markAsPaid"
                            startContent={
                                <CircleCheck
                                    size={14}
                                    className="text-text-subdued"
                                />
                            }
                            onPress={() => handleOpenMarkAsPaidModal()}
                        >
                            Mark as Paid
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
