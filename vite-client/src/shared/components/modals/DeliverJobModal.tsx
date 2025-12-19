import { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Input,
    Select,
    SelectItem,
} from '@heroui/react'
import { Send, Link as LinkIcon, Paperclip, CheckCircle2 } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jobsPendingDeliverOptions } from '../../../lib/queries'
import { JobStatusChip } from '../chips/JobStatusChip'

interface DeliverJobModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (data: { note: string; link?: string }) => void
}

export const DeliverJobModal = ({
    isOpen,
    onClose,
    onConfirm,
}: DeliverJobModalProps) => {
    const [note, setNote] = useState('')
    const [link, setLink] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { data: pendingDeliverJobs } = useSuspenseQuery({
        ...jobsPendingDeliverOptions(),
    })

    const handleSubmit = () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            onConfirm({ note, link })
            setIsLoading(false)
            onClose()
        }, 1000)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Send size={20} />
                                <span className="text-lg font-bold">
                                    Deliver Job
                                </span>
                            </div>
                            <p className="text-xs text-text-subdued font-normal">
                                This will change status to{' '}
                                <strong>DELIVERED</strong> and notify the
                                manager for review.
                            </p>
                        </ModalHeader>

                        <ModalBody className="py-4 space-y-4">
                            {pendingDeliverJobs ? (
                                <>
                                    <Textarea
                                        label="Delivery Note"
                                        placeholder="Describe what you are delivering..."
                                        variant="bordered"
                                        labelPlacement="outside"
                                        minRows={3}
                                        value={note}
                                        onValueChange={setNote}
                                    />

                                    <Select
                                        label="Select Job"
                                        placeholder="Which job is for delivery?"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        // onChange={(e) => setIssueType(e.target.value)}
                                    >
                                        {pendingDeliverJobs.map((job) => (
                                            <SelectItem
                                                key={job.id}
                                                textValue={job.displayName}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs text-text-subdued">
                                                            #{job.no}
                                                        </p>
                                                        <p className="text-text-sm font-semibold">
                                                            {job.displayName}
                                                        </p>
                                                    </div>
                                                    <JobStatusChip
                                                        data={job.status}
                                                        props={{
                                                            size: 'sm',
                                                        }}
                                                    />
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className="bg-background p-3 rounded-lg border border-border-default flex gap-3 items-start">
                                        <CheckCircle2
                                            size={18}
                                            className="text-text-default mt-0.5"
                                        />
                                        <div className="text-xs text-text-default tracking-wide">
                                            <strong>Checklist:</strong>
                                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                                <li>All assets uploaded?</li>
                                                <li>
                                                    Code pushed to correct
                                                    branch?
                                                </li>
                                                <li>
                                                    Client requirements met?
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>You no have pending deliver jobs</p>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            {pendingDeliverJobs ? (
                                <>
                                    <Button variant="light" onPress={close}>
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={handleSubmit}
                                        isLoading={isLoading}
                                        startContent={
                                            !isLoading && (
                                                <Paperclip size={18} />
                                            )
                                        }
                                    >
                                        Submit Delivery
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    color="primary"
                                    variant="solid"
                                    onPress={close}
                                >
                                    Close
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
