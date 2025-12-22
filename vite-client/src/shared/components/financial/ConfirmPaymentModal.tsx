import React, { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    User,
    Divider,
    Alert,
} from '@heroui/react'
import { Banknote, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react'
import dayjs from 'dayjs'
import { TJob } from '@/shared/types'

interface ConfirmPaymentModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    job: TJob | null
    onConfirm: (jobId: string) => Promise<void>
}

export const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
    isOpen,
    onOpenChange,
    job,
    onConfirm,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!job) return null

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            await onConfirm(job.id)
            onOpenChange(false)
        } catch (error) {
            console.error('Payment confirmation failed', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            size="md"
            classNames={{
                base: 'border-[#e4e4e7] dark:border-[#3f3f46] border-1',
                header: 'border-b-[1px] border-[#e4e4e7] dark:border-[#3f3f46]',
                footer: 'border-t-[1px] border-[#e4e4e7] dark:border-[#3f3f46]',
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Banknote className="text-success" size={20} />
                                <span>Confirm Staff Payout</span>
                            </div>
                        </ModalHeader>

                        <ModalBody className="py-6">
                            <div className="flex flex-col gap-4">
                                {/* Job Info Summary */}
                                <div className="flex justify-between items-start bg-default-50 p-3 rounded-xl border border-default-100">
                                    <div>
                                        <p className="text-[10px] text-default-400 uppercase font-bold tracking-wider">
                                            Job Number
                                        </p>
                                        <p className="text-sm font-mono font-bold text-primary">
                                            {job.no}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-default-400 uppercase font-bold tracking-wider">
                                            Completed At
                                        </p>
                                        <p className="text-xs font-medium">
                                            {dayjs(job.completedAt).format(
                                                'DD MMM YYYY'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Staff List */}
                                <div>
                                    <p className="text-xs font-semibold mb-2 text-default-500">
                                        Payable To:
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {job.assignee?.map((user) => (
                                            <User
                                                key={user.id}
                                                name={user.displayName}
                                                description={`@${user.username}`}
                                                avatarProps={{
                                                    src: user.avatar,
                                                    size: 'sm',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Divider />

                                {/* Payment Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-default-500">
                                            Payment Channel
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <CreditCard
                                                size={14}
                                                className="text-default-400"
                                            />
                                            <span className="text-sm font-semibold">
                                                {job.paymentChannel
                                                    ?.displayName ||
                                                    'Default Method'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
                                        <span className="text-sm font-bold text-success-700">
                                            Total Payout
                                        </span>
                                        <span className="text-xl font-mono font-black text-success-700">
                                            ${job.staffCost.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <Alert
                                    color="warning"
                                    title="Accounting Notice"
                                    variant="flat"
                                    className="text-xs"
                                    startContent={<AlertCircle size={16} />}
                                >
                                    Confirming this will move the job to
                                    "Finished" and notify staff. This action
                                    cannot be undone.
                                </Alert>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variant="light"
                                onPress={onClose}
                                isDisabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="success"
                                onPress={handleConfirm}
                                isLoading={isSubmitting}
                                className="font-bold text-white"
                                startContent={
                                    !isSubmitting && <CheckCircle2 size={18} />
                                }
                            >
                                Confirm & Pay
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
