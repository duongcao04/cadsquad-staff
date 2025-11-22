'use client'

import { ApiError } from '@/lib/axios'
import { HeroSelect, HeroSelectItem } from '@/shared/components'
import { Job } from '@/shared/interfaces'
import {
    usePaymentChannels,
    useProfile,
    useUpdateJobMutation,
} from '@/lib/queries'
import { addToast, Skeleton } from '@heroui/react'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
    isLoading?: boolean
    defaultEditMode?: boolean
    data?: Job
}
export function PaymentChannelView({
    isLoading = false,
    defaultEditMode = false,
    data,
}: Props) {
    const { isAdmin } = useProfile()
    const t = useTranslations()
    const { data: paymentChannels, isLoading: loadingPaymentChannels } =
        usePaymentChannels()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const [isEditMode, setIsEditMode] = useState(defaultEditMode)

    const handleUpdatePaymentChannel = async (paymentChannelId: string) => {
        await updateJobMutation(
            {
                jobId: String(data?.id),
                updateJobInput: {
                    paymentChannelId,
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
        <div>
            <Skeleton className="w-full h-fit rounded-md" isLoaded={!isLoading}>
                <button
                    className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-between"
                    style={{
                        cursor: isAdmin ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                        if (!isAdmin) {
                            return
                        }
                        setIsEditMode(!isEditMode)
                    }}
                >
                    <p className="text-sm text-text-muted">
                        {t('jobColumns.paymentChannel')}
                    </p>
                    {isAdmin && <Settings size={16} />}
                </button>
            </Skeleton>
            <Skeleton className="ml-2 mt-1 rounded-md" isLoaded={!isLoading}>
                {!isEditMode ? (
                    <p className="text-base font-semibold text-wrap">
                        {data?.paymentChannel
                            ? data?.paymentChannel?.displayName
                            : '-'}
                    </p>
                ) : (
                    <HeroSelect
                        isLoading={isUpdating || loadingPaymentChannels}
                        id="paymentChannelId"
                        name="paymentChannelId"
                        placeholder="Select one payment channel"
                        size="md"
                        defaultSelectedKeys={
                            data?.paymentChannelId
                                ? [data.paymentChannelId]
                                : []
                        }
                        onChange={(e) => {
                            const value = e.target.value
                            handleUpdatePaymentChannel(value)
                        }}
                        renderValue={(selectedItems) => {
                            const item = paymentChannels?.find(
                                (d) => d.id === selectedItems[0].key
                            )
                            if (!item)
                                return (
                                    <span className="text-gray-400">
                                        Select one payment channel
                                    </span>
                                )
                            return <span>{item.displayName}</span>
                        }}
                    >
                        {paymentChannels?.map((paymentChannel) => (
                            <HeroSelectItem key={paymentChannel.id}>
                                <div className="flex items-center justify-start gap-2">
                                    <div
                                        className="size-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                paymentChannel.hexColor
                                                    ? paymentChannel.hexColor
                                                    : 'transparent',
                                        }}
                                    />
                                    <p>{paymentChannel.displayName}</p>
                                </div>
                            </HeroSelectItem>
                        ))}
                    </HeroSelect>
                )}
            </Skeleton>
        </div>
    )
}
