'use client'

import { ApiError } from '@/lib/axios'
import { HeroButton } from '@/shared/components'
import { Job } from '@/shared/interfaces'
import { useUpdateJobMutation } from '@/lib/queries'
import { addToast, Input, Skeleton } from '@heroui/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type Props = {
    isEditMode?: boolean
    setEditMode?: React.Dispatch<React.SetStateAction<boolean>>
    isLoading?: boolean
    data?: Job
}

export function JobName({
    isEditMode = false,
    isLoading = false,
    data,
    setEditMode,
}: Props) {
    const t = useTranslations()
    const [inputValue, setInputValue] = useState(data?.displayName)
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()

    const handleUpdateJobName = async () => {
        await updateJobMutation(
            {
                jobId: String(data?.id),
                updateJobInput: {
                    displayName: inputValue,
                },
            },
            {
                onSuccess: (res) => {
                    setEditMode?.(false)
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
        <Skeleton className="h-fit w-full rounded-md" isLoaded={!isLoading}>
            {!isEditMode ? (
                <p className="align-bottom text-3xl font-semibold">
                    {data?.displayName}
                </p>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleUpdateJobName()
                    }}
                    className="grid grid-cols-[1fr_120px] gap-5 my-4"
                >
                    <Input
                        defaultValue={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        style={{
                            fontSize: isEditMode
                                ? 'var(--text-lg)'
                                : 'var(--text-2xl)',
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
                                setEditMode?.(false)
                                setInputValue(data?.displayName)
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
    )
}
