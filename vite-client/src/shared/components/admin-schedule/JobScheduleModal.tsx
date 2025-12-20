import {
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'
import { format, parseISO } from 'date-fns'
import { Clock, Plus } from 'lucide-react'
import { TJob } from '../../types'

type JobScheduleModalProps = {
    isOpen: boolean
    onClose: () => void
    selectedJob: TJob
}
export default function JobScheduleModal({
    isOpen,
    onClose,
    selectedJob,
}: JobScheduleModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider">
                                <Clock size={12} />
                                {selectedJob &&
                                    format(
                                        parseISO(selectedJob.dueAt),
                                        'MMMM d, yyyy • h:mm a'
                                    )}
                            </div>
                            <span className="text-xl">
                                {selectedJob?.displayName}
                            </span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-2 mb-4">
                                <Chip
                                    variant="flat"
                                    style={{
                                        backgroundColor: `${selectedJob?.hexColor}20`,
                                        color: selectedJob?.hexColor,
                                    }}
                                >
                                    {selectedJob?.status}
                                </Chip>
                                <span className="text-sm text-slate-500">
                                    for{' '}
                                    <strong>{selectedJob?.clientName}</strong>
                                </span>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-border-default mb-4">
                                <p className="text-sm font-semibold text-slate-700 mb-2">
                                    Assignees
                                </p>
                                <div className="flex items-center gap-3">
                                    <AvatarGroup max={3} isBordered>
                                        {selectedJob?.assignee.map((a, i) => (
                                            <Avatar
                                                key={i}
                                                src={a.avatar}
                                                name={a.displayName}
                                            />
                                        ))}
                                    </AvatarGroup>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        startContent={<Plus size={14} />}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500">
                                This job is currently in the{' '}
                                <strong>{selectedJob?.status}</strong> phase.
                                Ensure all deliverables are uploaded before the
                                deadline.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Delete
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Edit Details
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
