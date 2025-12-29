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
    Paperclip,
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
import AddAttachmentsModal from './AddAttachmentsModal'
import UpdateCostModal from './UpdateCostModal'

type ProjectCenterTableQuickActionsProps = {
    data: TJob
}

export function ProjectCenterTableQuickActions({
    data,
}: ProjectCenterTableQuickActionsProps) {
    const { isAdmin, isAccounting } = useProfile()

    // --- Mutations ---
    const markAsPaidMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Payment Status Updated',
            description: `#${res.result?.no ?? data?.no} marked as paid`,
            color: 'success',
        })
        queryClient.invalidateQueries({ queryKey: ['jobs'] })
    })

    const { mutateAsync: deleteJobMutation, isPending: isDeleting } = useDeleteJobMutation()

    // --- Modal Controllers ---
    const assignModal = useDisclosure()
    const deleteModal = useDisclosure()
    const paidConfirmModal = useDisclosure()
    const updateCostModal = useDisclosure()
    const attachmentModal = useDisclosure()

    // --- Handlers ---
    const onDeleteJob = async () => {
        await deleteJobMutation(data?.id, {
            onSuccess: () => deleteModal.onClose(),
        })
    }

    const handleOpenMarkAsPaidModal = () => {
        if (data.isPaid) {
            addToast({
                title: 'Action redundant',
                description: `#${data.no} is already paid`,
                color: 'warning',
            })
        } else {
            paidConfirmModal.onOpen()
        }
    }

    const handleMarkAsPaid = async () => {
        if (!data?.id) return
        await markAsPaidMutation.mutateAsync(
            {
                jobId: data.id,
                data: { isPaid: true },
            },
            {
                onSuccess: () => paidConfirmModal.onClose(),
            }
        )
    }

    return (
        <>
            {/* 1. Assignment Modal (Member selection + Cost input) */}
            <AssignMemberModal
                isOpen={assignModal.isOpen}
                onClose={assignModal.onClose}
                jobNo={data.no}
            />

            {/* 2. Attachment Modal (URL / File links) */}
            <AddAttachmentsModal
                isOpen={attachmentModal.isOpen}
                onClose={attachmentModal.onClose}
                jobNo={data.no}
            />

            {/* 3. Delete Confirmation */}
            {deleteModal.isOpen && (
                <ConfirmDeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    onConfirm={onDeleteJob}
                    title="Delete Job"
                    description={`Are you sure you want to permanently delete job #${data?.no}?`}
                    isLoading={isDeleting}
                />
            )}

            {/* 4. Payment Confirmation */}
            {paidConfirmModal.isOpen && (
                <ConfirmDeleteModal
                    isOpen={paidConfirmModal.isOpen}
                    onClose={paidConfirmModal.onClose}
                    onConfirm={handleMarkAsPaid}
                    title={`Mark #${data.no} as Paid`}
                    description="This confirms the project is settled. Staff will be notified."
                    confirmText="Confirm Payment"
                    isLoading={markAsPaidMutation.isPending}
                    color="primary"
                />
            )}

            {/* 5. Update Cost Modal */}
            {updateCostModal.isOpen && (
                <UpdateCostModal
                    isOpen={updateCostModal.isOpen}
                    onClose={updateCostModal.onClose}
                    data={data}
                />
            )}

            {/* --- DROPDOWN TRIGGER --- */}
            <Dropdown placement="bottom-end" backdrop="blur">
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm" radius="full">
                        <EllipsisVerticalIcon size={18} className="text-default-400" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Action menu" 
                    variant="flat"
                    disabledKeys={data.isPaid ? ['markAsPaid'] : []}
                >
                    {/* General Section: Visible to All */}
                    <DropdownSection title="General">
                        <DropdownItem
                            key="openDetail"
                            startContent={<SquareArrowOutUpRight size={16} />}
                            onPress={() => window.open(INTERNAL_URLS.getJobDetailUrl(data.no), '_blank')}
                        >
                            Open detail
                        </DropdownItem>
                        <DropdownItem
                            key="attachments"
                            startContent={<Paperclip size={16} />}
                            onPress={attachmentModal.onOpen}
                        >
                            Add attachments
                        </DropdownItem>
                    </DropdownSection>

                    {/* Admin Section: Management */}
                    {isAdmin && (
                        <DropdownSection title="Management">
                            <DropdownItem
                                key="assign"
                                startContent={<UserPlus size={16} />}
                                onPress={assignModal.onOpen}
                            >
                                Assign / Reassign
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                color="danger"
                                className="text-danger"
                                startContent={<Trash size={16} />}
                                onPress={deleteModal.onOpen}
                            >
                                Delete job
                            </DropdownItem>
                        </DropdownSection>
                    )}

                    {/* Financial Section: Admin & Accounting Only */}
                    {(isAdmin || isAccounting) && (
                        <DropdownSection title="Accounting">
                            <DropdownItem
                                key="updateCost"
                                startContent={<CircleDollarSign size={16} />}
                                onPress={updateCostModal.onOpen}
                            >
                                Update project cost
                            </DropdownItem>
                            <DropdownItem
                                key="markAsPaid"
                                color="primary"
                                startContent={<CircleCheck size={16} />}
                                onPress={handleOpenMarkAsPaidModal}
                            >
                                Mark as paid
                            </DropdownItem>
                        </DropdownSection>
                    )}
                </DropdownMenu>
            </Dropdown>
        </>
    )
}