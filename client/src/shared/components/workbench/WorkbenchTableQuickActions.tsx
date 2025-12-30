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
    PinOff,
    SquareArrowOutUpRight,
    Trash,
    TruckElectricIcon,
    UserPlus,
} from 'lucide-react'

import {
    useDeleteJobMutation,
    useMarkPaidMutation,
    useProfile,
    useTogglePinJobMutation,
} from '@/lib/queries'
import type { TJob } from '@/shared/types'
import { INTERNAL_URLS } from '../../../lib'
import ReScheduleModal from '../modals/ReScheduleModal'
import AssignMemberModal from '../project-center/AssignMemberModal'
import UpdateCostModal from '../project-center/UpdateCostModal'
import ConfirmModal from '../ui/confirm-modal'
import { DeliverJobModal } from '../modals/DeliverJobModal'

type WorkbenchTableQuickActionsProps = {
    data: TJob
}
export function WorkbenchTableQuickActions({
    data,
}: WorkbenchTableQuickActionsProps) {
    const { isAdmin, isAccounting } = useProfile()

    const jobPinned = data.isPinned

    const markAsPaidMutation = useMarkPaidMutation()

    const togglePinJobMutation = useTogglePinJobMutation()

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

    const deliverJobModal = useDisclosure({
        id: 'DeliverJobModal',
    })

    const onDeleteJob = async () => {
        await deleteJobMutation(data?.id, {
            onSuccess: () => {
                onCloseModal()
            },
        })
    }

    const handleOpenMarkAsPaidModal = () => {
        if (data.isPaid) {
            addToast({
                title: `Job #${data.no} already paid`,
                color: 'danger',
            })
        } else {
            onOpenMAPModal()
        }
    }

    const handleMarkAsPaid = async () => {
        if (data?.id) {
            await markAsPaidMutation.mutateAsync(data.id, {
                onSuccess: () => {
                    onCloseMAPModal()
                },
            })
        }
    }

    const handleTogglePin = async () => {
        togglePinJobMutation.mutateAsync(data.id, {
            onSuccess: () => {
                onCloseModal()
            },
        })
    }

    return (
        <>
            {isOpenModal && (
                <ConfirmModal
                    isOpen={isOpenModal}
                    onClose={onCloseModal}
                    onConfirm={onDeleteJob}
                    title="Delete job"
                    content={`Are you sure you want to delete job ${data.no}? This action cannot be undone.`}
                    confirmLabel="Yes"
                    isLoading={isDeleting}
                />
            )}
            {deliverJobModal.isOpen && (
                <DeliverJobModal
                    isOpen={deliverJobModal.isOpen}
                    onClose={deliverJobModal.onClose}
                    onConfirm={() => {}}
                    defaultJob={data.id}
                />
            )}
            {isOpenUCostModal && (
                <UpdateCostModal
                    isOpen={isOpenUCostModal}
                    onClose={onCloseUCostModal}
                    jobNo={data.no}
                />
            )}
            {isOpenMAPModal && (
                <ConfirmModal
                    isOpen={isOpenMAPModal}
                    onClose={onCloseMAPModal}
                    onConfirm={handleMarkAsPaid}
                    title={`Mark job $${data.no} as paid`}
                    content={`Are you sure you want to mark job ${data.no} as paid? This action will confirm that the payment has been received.`}
                    variant="warning"
                    confirmLabel="Yes"
                    isLoading={markAsPaidMutation.isPending}
                />
            )}

            {isOpenRescheduleModal && (
                <ReScheduleModal
                    isOpen={isOpenRescheduleModal}
                    onClose={onCloseRescheduleModal}
                    job={data}
                />
            )}

            {isOpenAssignModal && (
                <AssignMemberModal
                    isOpen={isOpenAssignModal}
                    onClose={onCloseAssignModal}
                    jobNo={data.no}
                />
            )}

            <Dropdown>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <EllipsisVerticalIcon size={16} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Job menu actions">
                    <DropdownSection key="quick_action" title="Quick actions">
                        <DropdownItem
                            key="openInNewTab"
                            startContent={
                                <TruckElectricIcon
                                    className="text-text-default"
                                    size={14}
                                />
                            }
                            onPress={deliverJobModal.onOpen}
                        >
                            Deliver Job
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection key="feature_actions" title="View">
                        <DropdownItem
                            key="openInNewTab"
                            startContent={
                                <SquareArrowOutUpRight
                                    className="text-text-default"
                                    size={14}
                                />
                            }
                            onPress={() =>
                                window.open(
                                    INTERNAL_URLS.getJobDetailUrl(data.no),
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
                                jobPinned ? (
                                    <PinOff
                                        size={14}
                                        className="text-text-default"
                                    />
                                ) : (
                                    <PinIcon
                                        size={14}
                                        className="text-text-default"
                                    />
                                )
                            }
                            onPress={handleTogglePin}
                        >
                            {jobPinned ? 'Unpin' : 'Pin'}
                        </DropdownItem>
                        <DropdownItem
                            key="assignReassign"
                            style={{
                                display: isAdmin ? 'flex' : 'none',
                            }}
                            startContent={
                                <UserPlus
                                    size={14}
                                    className="text-text-default"
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
                                    className="text-text-default"
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
                                    className="text-text-default"
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
                                    className="text-text-default"
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
                                    className="text-text-default"
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
