'use client'

import { ApiError } from '@/lib/axios'
import { HeroButton } from '@/shared/components/ui/hero-button'
import { Job } from '@/shared/interfaces'
import { useProfile, useUpdateJobMutation } from '@/lib/queries'
import { addToast, Input, Skeleton } from '@heroui/react'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const ClientName = ({
    isLoading = false,
    defaultEditMode = false,
    data,
}: {
    isLoading?: boolean
    data?: Job
    defaultEditMode?: boolean
}) => {
    const { isAdmin } = useProfile()
    const t = useTranslations()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const [isEditMode, setIsEditMode] = useState(defaultEditMode)
    const [inputValue, setInputValue] = useState(data?.clientName)

    const handleUpdateClientName = async () => {
        await updateJobMutation(
            {
                jobId: String(data?.id),
                updateJobInput: {
                    clientName: inputValue,
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
        <div className="w-full overflow-hidden">
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
                        setIsEditMode(true)
                    }}
                >
                    <p className="text-xs text-text-muted">
                        {t('jobColumns.clientName')}
                    </p>
                    {isAdmin && <Settings size={16} />}
                </button>
            </Skeleton>
            <Skeleton className="ml-2 mt-1 rounded-md" isLoaded={!isLoading}>
                {!isEditMode ? (
                    <p className="text-sm font-medium">
                        {data?.clientName ? data.clientName : '-'}
                    </p>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleUpdateClientName()
                        }}
                        className="grid grid-cols-[1fr_120px] gap-8"
                    >
                        <Input
                            defaultValue={data?.clientName}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: '500',
                                textWrap: 'wrap',
                            }}
                            size="sm"
                            variant="underlined"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <HeroButton
                                variant="bordered"
                                onPress={() => {
                                    setIsEditMode(false)
                                    setInputValue(data?.clientName)
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
