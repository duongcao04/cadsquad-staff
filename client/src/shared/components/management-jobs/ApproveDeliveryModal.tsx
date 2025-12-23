import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react'
import { AlertTriangle } from 'lucide-react'

interface ApproveDeliveryModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
}

export default function ApproveDeliveryModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: ApproveDeliveryModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            hideCloseButton={isLoading}
            isDismissable={!isLoading}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Confirm Approval
                        </ModalHeader>

                        <ModalBody>
                            <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg text-primary-600 dark:bg-primary-900/20">
                                <AlertTriangle className="size-6 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">
                                        This action cannot be undone.
                                    </p>
                                    <p>
                                        The job will be marked as{' '}
                                        <strong>Completed</strong> and the staff
                                        member will be notified.
                                    </p>
                                </div>
                            </div>
                            <p className="text-default-500 text-sm mt-2">
                                Are you sure you want to approve this delivery?
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={onClose}
                                isDisabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={onConfirm}
                                isLoading={isLoading}
                            >
                                Approve Delivery
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
