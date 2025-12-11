'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'
import {
    useDeleteJobMutation,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
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
    CalendarClock,
    CircleCheck,
    CircleDollarSign,
    EllipsisVerticalIcon,
    PinIcon,
    SquareArrowOutUpRight,
    Trash,
    UserPlus,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import AssignMemberModal from '../project-center/AssignMemberModal'
import UpdateCostModal from '../project-center/UpdateCostModal'
import ConfirmModal from '../ui/confirm-modal'
import ReScheduleModal from '../modals/ReScheduleModal'

type WorkbenchTableQuickActionsProps = {
    data: TJob
}
export function WorkbenchTableQuickActions({
    data,
}: WorkbenchTableQuickActionsProps) {
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
        isOpen: isOpenRescheduleModal,
        onOpen: onOpenRescheduleModal,
        onClose: onCloseRescheduleModal,
    } = useDisclosure({
        id: 'RescheduleModal',
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
                    data: {
                        isPaid: true,
                    },
                },
                {
                    onSuccess: (res) => {
                        addToast({
                            title: t('successfully'),
                            description: t('markJobAsPaidSuccess', {
                                jobNo: `#${res.data.result?.no ?? data?.no}`,
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
            <ConfirmModal
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onConfirm={onDeleteJob}
                title={t('deleteJob')}
                content={t('deleteJobDesc', {
                    jobNo: `#${data?.no}`,
                })}
                confirmLabel={t('yes')}
                isLoading={isDeleting}
            />
            <UpdateCostModal
                isOpen={isOpenUCostModal}
                onClose={onCloseUCostModal}
                data={data}
            />
            <ConfirmModal
                isOpen={isOpenMAPModal}
                onClose={onCloseMAPModal}
                onConfirm={handleMarkAsPaid}
                title={t('markJobAsPaid', {
                    jobNo: `#${data.no}`,
                })}
                content={t('markJobAsPaidDesc', {
                    jobNo: `#${data.no}`,
                })}
                variant="warning"
                confirmLabel={t('yes')}
                isLoading={isUpdating}
            />
            <ReScheduleModal
                isOpen={isOpenRescheduleModal}
                onClose={onCloseRescheduleModal}
                job={data}
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
                            key="assignReassign"
                            style={{
                                display: isAdmin ? 'flex' : 'none',
                            }}
                            startContent={
                                <CalendarClock
                                    size={14}
                                    className="text-text-subdued"
                                />
                            }
                            onPress={() => onOpenRescheduleModal()}
                        >
                            Reschedule
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
