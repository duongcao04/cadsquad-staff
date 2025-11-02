'use client'

import { Link } from '@/i18n/navigation'
import { ApiError } from '@/lib/axios'
import { HeroButton } from '@/shared/components'
import { Job } from '@/shared/interfaces'
import { useProfile, useUpdateJobMutation } from '@/lib/queries'
import {
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    addToast,
    useDisclosure,
} from '@heroui/react'
import { Settings, SquareArrowOutUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export const Attachments = ({
    isLoading = false,
    data,
}: {
    isLoading: boolean
    data: Job
}) => {
    const { isAdmin } = useProfile()
    const t = useTranslations()
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [value, setValue] = useState('')

    const handleOpen = () => {
        if (!isAdmin) {
            return
        }
        onOpen()
    }

    const handleAddAttachments = async () => {
        const newAttsValue = data.attachmentUrls
            ? [...data.attachmentUrls, value]
            : data.attachmentUrls
        await updateJobMutation(
            {
                jobId: data.id,
                updateJobInput: {
                    attachmentUrls: newAttsValue,
                },
            },
            {
                onSuccess: (res) => {
                    onClose()
                    setValue('')
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
            <Popover
                placement="bottom-start"
                classNames={{
                    base: 'w-full',
                    content: 'rounded-md',
                }}
                showArrow
                triggerScaleOnOpen={false}
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={handleOpen}
            >
                <PopoverTrigger>
                    <Skeleton
                        className="w-full h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <button
                            className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-center justify-between"
                            style={{
                                cursor: isAdmin ? 'pointer' : 'default',
                            }}
                        >
                            <p className="text-xs text-text-muted">
                                {t('jobColumns.attachmentUrls')} (
                                {data?.attachmentUrls?.length ?? 0})
                            </p>
                            {isAdmin && <Settings size={16} />}
                        </button>
                    </Skeleton>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100%+64px)] px-4 py-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleAddAttachments()
                        }}
                        className="size-full"
                    >
                        <Input
                            value={value}
                            className="!text-sm !font-semibold"
                            placeholder="Enter url here"
                            size="sm"
                            variant="underlined"
                            onChange={async (e) => {
                                setValue(e.target.value)
                            }}
                        />
                        <div className="w-full mt-3 flex items-center justify-end gap-1">
                            <HeroButton
                                variant="solid"
                                size="sm"
                                color="blue"
                                type="submit"
                                isLoading={isUpdating}
                            >
                                {t('add')}
                            </HeroButton>
                        </div>
                    </form>
                </PopoverContent>
            </Popover>
            {data?.attachmentUrls?.length ? (
                data.attachmentUrls.map((attachment, idx) => {
                    return (
                        <Skeleton
                            key={idx}
                            className="rounded-md"
                            isLoaded={!isLoading}
                        >
                            <Link
                                href={attachment}
                                target="_blank"
                                className="link !block"
                            >
                                <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background-muted flex items-start justify-start cursor-pointer gap-2 group">
                                    <SquareArrowOutUpRight
                                        size={12}
                                        className="mt-1.5 hidden group-hover:block transition duration-150"
                                    />
                                    <span className="text-left">
                                        {attachment}
                                    </span>
                                </button>
                            </Link>
                        </Skeleton>
                    )
                })
            ) : (
                <p className="pl-2 pt-0.5 text-xs">
                    {t('noAttachments')} -{' '}
                    <button
                        className="inline-block link !text-blue-600"
                        onClick={handleOpen}
                    >
                        {t('addOne')}
                    </button>
                </p>
            )}
        </div>
    )
}
