'use client'

import { queryClient } from '@/app/providers/TanstackQueryProvider'
import { ApiError } from '@/lib/axios'
import { Job } from '@/shared/interfaces'
import { useUpdateJobMutation } from '@/lib/queries'
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
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

type Props = {
    data: Job
    isOpen: boolean
    onClose: () => void
    isLoading?: boolean
}
export default function UpdateCostModal({ data, isOpen, onClose }: Props) {
    const t = useTranslations()

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

    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()

    const handleUpdate = async () => {
        if (data?.id) {
            await updateJobMutation(
                {
                    jobId: data.id,
                    updateJobInput: {
                        staffCost: staffCostValue,
                        incomeCost: incomeCostValue,
                    },
                },
                {
                    onSuccess: (res) => {
                        addToast({
                            title: t('success'),
                            description: res.data.message,
                            color: 'success',
                        })
                        queryClient.invalidateQueries({
                            queryKey: ['jobs'],
                        })
                        onClose()
                    },
                    onError: (error) => {
                        const err = error as unknown as ApiError
                        addToast({
                            title: t('failed'),
                            description: err.message,
                            color: 'danger',
                        })
                    },
                }
            )
        } else {
            addToast({
                title: t('error'),
                color: 'danger',
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
                            label={t('jobColumns.incomeCost')}
                            startContent={
                                <p className="text-sm font-bold text-defaultp5">
                                    đ
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
                            label={t('jobColumns.staffCost')}
                            startContent={
                                <p className="text-sm font-bold text-defaultp5">
                                    $
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
                        {t('cancel')}
                    </Button>
                    <Button
                        color="primary"
                        isLoading={isUpdating}
                        onPress={handleUpdate}
                    >
                        {t('update')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
