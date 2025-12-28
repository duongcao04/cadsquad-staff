import { addToast, Divider } from '@heroui/react'
import { Trash2 } from 'lucide-react'

import { useJobByNo, useUpdateJobMutation } from '@/lib/queries/useJob'

import JobAttachmentsField from '../form-fields/JobAttachmentsField'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'

type AddAttachmentsModalProps = {
    jobNo: string
    isOpen: boolean
    onClose: () => void
}
export default function AddAttachmentsModal({
    jobNo,
    isOpen,
    onClose,
}: AddAttachmentsModalProps) {
    const { job } = useJobByNo(jobNo)

    const updateAttachmentMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Attachments updated',
            description: `The attachments for job ${res.result?.no} have been updated.`,
            color: 'success',
        })
    })

    const removeAttachmentMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Attachment removed',
            description: `The attachment for job ${res.result?.no} has been removed.`,
            color: 'success',
            icon: <Trash2 />,
        })
    })

    const handleAddAttachment = (attachments: string[]) => {
        if (job) {
            updateAttachmentMutation.mutate({
                jobId: job.id,
                data: {
                    attachmentUrls: attachments,
                },
            })
        }
    }
    const handleRemoveAttachment = (attachments: string[]) => {
        if (job) {
            removeAttachmentMutation.mutate({
                jobId: job.id,
                data: {
                    attachmentUrls: attachments,
                },
            })
        }
    }

    return (
        <HeroModal
            isOpen={isOpen}
            onClose={() => {
                onClose()
            }}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[50%]',
            }}
            placement="center"
        >
            <HeroModalContent>
                <HeroModalHeader className="pb-0">
                    <p className="text-lg font-semibold">
                        Add attachments for #{jobNo}
                    </p>
                </HeroModalHeader>
                <Divider className="bg-background-muted" />
                <HeroModalBody className="pb-6 px-4">
                    <JobAttachmentsField
                        onChange={handleAddAttachment}
                        onRemove={handleRemoveAttachment}
                    />
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}
