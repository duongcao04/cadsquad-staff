'use client'

import { HeroButton } from '@/shared/components/customize/HeroButton'
import { Job } from '@/shared/interfaces/job.interface'
import { useUpdateJobMutation } from '@/shared/queries/useJob'
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
import { useState } from 'react'
import { Link } from '../../../../../../../../i18n/navigation'

const Attachments = ({
    isLoading = false,
    data,
}: {
    isLoading: boolean
    data: Job
}) => {
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [value, setValue] = useState('')
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
                onOpenChange={onOpen}
            >
                <PopoverTrigger>
                    <Skeleton
                        className="w-full h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background2 flex items-center justify-between cursor-pointer">
                            <p className="text-xs text-text2">
                                Attachments ({data?.attachmentUrls?.length ?? 0}
                                )
                            </p>
                            <Settings size={16} />
                        </button>
                    </Skeleton>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100%+64px)] px-4 py-3">
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
                            onPress={async () => {
                                const newAttsValue = data.attachmentUrls
                                    ? [...data.attachmentUrls, value]
                                    : data.attachmentUrls
                                console.log(newAttsValue)
                                await updateJobMutation({
                                    jobId: data.id,
                                    updateJobInput: {
                                        attachmentUrls: newAttsValue,
                                    },
                                })
                                addToast({
                                    title: 'Thêm mới tài liệu thành công',
                                    color: 'success',
                                })
                            }}
                            isLoading={isUpdating}
                        >
                            Add
                        </HeroButton>
                    </div>
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
                                <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background2 flex items-start justify-start cursor-pointer gap-2 group">
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
                    No attachments -{' '}
                    <span className="link !text-blue-600">Add one</span>
                </p>
            )}
        </div>
    )
}

export default Attachments
