import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    NumberInput,
} from '@heroui/react'
import { useMemo, useState } from 'react'

import { useUpdateJobMutation } from '@/lib/queries'
import type { TJob } from '@/shared/types'

type Props = {
    data: TJob
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
}
export default function UpdateCostModal({ data, isOpen, onClose }: Props) {
    const initialValues = useMemo(() => {
        return {
            incomeCost: data?.incomeCost,
            staffCost: data?.staffCost,
        }
    }, [data])

    const [incomeCostValue, setIncomeCostValue] = useState<number | undefined>(
        initialValues.incomeCost
    )
    const [staffCostValue, setStaffCostValue] = useState<number | undefined>(
        initialValues.staffCost
    )

    const handleCancel = () => {
        onClose()
        setIncomeCostValue(initialValues.incomeCost)
        setStaffCostValue(initialValues.staffCost)
    }

    const updateJobMutation = useUpdateJobMutation((res) => {
        addToast({
            title: 'Update cost successfully',
            description: `${res.result?.no} has been updated.`,
            color: 'success',
        })
    })

    const handleUpdate = async () => {
        if (data?.id) {
            await updateJobMutation.mutateAsync({
                jobId: data.id,
                data: {
                    staffCost: staffCostValue,
                    incomeCost: incomeCostValue,
                },
            })
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            placement="center"
            hideCloseButton
            classNames={{
                base: '!p-0',
            }}
            size="lg"
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.2,
                            type: 'spring',
                            bounce: 0,
                            damping: 25,
                            stiffness: 300,
                        },
                    },
                    exit: {
                        y: 20,
                        opacity: 0,
                        scale: 0.95,
                        transition: {
                            duration: 0.1,
                            ease: 'easeIn',
                        },
                    },
                },
            }}
        >
            <ModalContent className="p-2">
                <ModalHeader
                    className="font-semibold text-lg text-white"
                    style={{
                        backgroundColor: 'var(--color-primary)',
                    }}
                >
                    <p>Update cost value for #{data?.no}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="pt-2.5 px-0 space-y-4">
                        <NumberInput
                            id="incomeCost"
                            name="incomeCost"
                            label="Income cost"
                            startContent={
                                <p className="text-sm font-bold text-text-subdued">
                                    $
                                </p>
                            }
                            placeholder="Enter new income cost value"
                            value={incomeCostValue}
                            onValueChange={setIncomeCostValue}
                            variant="underlined"
                            hideStepper
                        />
                        <NumberInput
                            id="staffCost"
                            name="staffCost"
                            label="Staff cost"
                            startContent={
                                <p className="text-sm font-bold text-text-subdued">
                                    đ
                                </p>
                            }
                            placeholder="Enter new staff cost value"
                            value={staffCostValue}
                            onValueChange={setStaffCostValue}
                            variant="underlined"
                            hideStepper
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        isLoading={updateJobMutation.isPending}
                        onPress={handleUpdate}
                    >
                        Update
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
