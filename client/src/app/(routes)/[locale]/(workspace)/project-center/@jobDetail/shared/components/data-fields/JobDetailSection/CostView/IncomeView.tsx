'use client'

import { ApiError } from '@/lib/axios'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { HeroButton } from '@/shared/components'
import { Job } from '@/shared/interfaces'
import { useUpdateJobMutation } from '@/lib/queries'
import { addToast, NumberInput, Skeleton } from '@heroui/react'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = { isLoading?: boolean; defaultEditMode?: boolean; data?: Job }
export function IncomeView({
    isLoading = false,
    defaultEditMode = false,
    data,
}: Props) {
    const t = useTranslations()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const [isEditMode, setIsEditMode] = useState(defaultEditMode)
    const [inputValue, setInputValue] = useState(data?.incomeCost)

    const handleUpdateIncome = async () => {
        await updateJobMutation(
            {
                jobId: String(data?.id),
                updateJobInput: {
                    incomeCost: inputValue,
                },
            },
            {
                onSuccess: (res) => {
                    setIsEditMode(false)
                    addToast({
                        title: res.data.message,
                        color: 'success',
                    })
                },
                onError: (error) => {
                    const err = error as unknown as ApiError
                    addToast({
                        title: err.message,
                        color: 'danger',
                    })
                },
            }
        )
    }

    return (
        <div className="pr-2">
            <Skeleton className="w-full h-fit rounded-md" isLoaded={!isLoading}>
                <button
                    className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-between cursor-pointer"
                    onClick={() => setIsEditMode(true)}
                >
                    <p className="text-sm text-text-muted">
                        {t('jobColumns.incomeCost')}
                    </p>
                    <Settings size={16} />
                </button>
            </Skeleton>
            <Skeleton className="ml-2 mt-1 rounded-md" isLoaded={!isLoading}>
                {!isEditMode ? (
                    <p className="text-base font-bold text-currency">
                        {formatCurrencyVND(
                            parseInt(String(data?.incomeCost)),
                            'en-US',
                            'USD'
                        )}
                    </p>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleUpdateIncome()
                        }}
                        className="grid grid-cols-[1fr_120px] gap-8"
                    >
                        <NumberInput
                            startContent={
                                <p className="text-base font-semibold">$</p>
                            }
                            size="sm"
                            defaultValue={parseInt(String(inputValue))}
                            style={{
                                fontSize: 'var(--text-base)',
                                fontWeight: '500',
                                textWrap: 'wrap',
                            }}
                            classNames={{
                                inputWrapper: 'h-[20px]',
                            }}
                            hideStepper
                            variant="underlined"
                            onValueChange={(value) => {
                                setInputValue(value)
                            }}
                        />
                        <div className="flex items-center justify-end gap-2">
                            <HeroButton
                                variant="bordered"
                                onPress={() => {
                                    setIsEditMode(false)
                                    setInputValue(data?.incomeCost)
                                }}
                            >
                                {t('cancel')}
                            </HeroButton>
                            <HeroButton
                                color="blue"
                                variant="solid"
                                type="submit"
                                isLoading={isUpdating}
                            >
                                {t('save')}
                            </HeroButton>
                        </div>
                    </form>
                )}
            </Skeleton>
        </div>
    )
}
