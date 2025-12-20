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
    SquareArrowOutUpRight,
    Trash,
    UserPlus,
} from 'lucide-react'

import {
    useDeleteJobMutation,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { ConfirmDeleteModal } from '@/shared/components'
import type { TJob } from '@/shared/types'

import { INTERNAL_URLS } from '../../../lib'
import { queryClient } from '../../../main'
import AssignMemberModal from './AssignMemberModal'
import UpdateCostModal from './UpdateCostModal'

type ProjectCenterTableQuickActionsProps = {
    data: TJob
}
export function ProjectCenterTableQuickActions({
    data,
}: ProjectCenterTableQuickActionsProps) {
    const { isAdmin, isAccounting } = useProfile()

    const markAsPaidMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Mark as paid successfully',
            description: `#${res.result?.no ?? data?.no} has been marked as paid`,
            color: 'success',
        })
        queryClient.invalidateQueries({
            queryKey: ['jobs'],
        })
    })

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
        if (data.isPaid) {
            addToast({
                title: `#${data.no} is already paid`,
                color: 'danger',
            })
        } else {
            onOpenMAPModal()
        }
    }

    const handleMarkAsPaid = async () => {
        if (data?.id) {
            await markAsPaidMutation.mutateAsync(
                {
                    jobId: data?.id,
                    data: {
                        isPaid: true,
                    },
                },
                {
                    onSuccess: () => {
                        onCloseMAPModal()
                    },
                }
            )
        }
    }

    return (
        <>
            {isOpenModal && (
                <ConfirmDeleteModal
                    isOpen={isOpenModal}
                    onClose={onCloseModal}
                    onConfirm={onDeleteJob}
                    title={'Delete job'}
                    description={`#${data?.no}`}
                    isLoading={isDeleting}
                    style={{
                        zIndex: 9999999999,
                    }}
                />
            )}
            {isOpenUCostModal && (
                <UpdateCostModal
                    isOpen={isOpenUCostModal}
                    onClose={onCloseUCostModal}
                    data={data}
                />
            )}
            {isOpenMAPModal && (
                <ConfirmDeleteModal
                    isOpen={isOpenMAPModal}
                    onClose={onCloseMAPModal}
                    onConfirm={handleMarkAsPaid}
                    title={`Mark #${data.no} as paid`}
                    description={`Are you sure you want to mark #${data.no} as paid? This action cannot be undone.`}
                    confirmText="Yes"
                    isLoading={markAsPaidMutation.isPending}
                    style={{
                        zIndex: 9999999999,
                    }}
                    color="primary"
                />
            )}

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
