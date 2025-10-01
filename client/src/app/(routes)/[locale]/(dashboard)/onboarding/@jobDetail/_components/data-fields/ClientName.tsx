'use client'

import {
    useDisclosure,
    PopoverTrigger,
    PopoverContent,
    addToast,
} from '@heroui/react'
import { Popover, Skeleton, Input } from '@heroui/react'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { HeroButton } from '@/shared/components/customize/HeroButton'
import { Job } from '@/shared/interfaces/job.interface'
import { useUpdateJobMutation } from '@/shared/queries/useJob'

const ClientName = ({
    isLoading = false,
    data,
}: {
    isLoading: boolean
    data: Job
}) => {
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [value, setValue] = useState(data?.clientName)
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
                            <p className="text-xs text-text2">Client name</p>
                            <Settings size={16} />
                        </button>
                    </Skeleton>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100%+64px)] px-4 py-3">
                    <Input
                        value={value}
                        className="!text-sm !font-semibold"
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
                                await updateJobMutation({
                                    jobId: data.id,
                                    updateJobInput: {
                                        clientName: value,
                                    },
                                })
                                addToast({
                                    title: 'Cập nhật thành công',
                                    color: 'success',
                                })
                            }}
                            isLoading={isUpdating}
                        >
                            Save
                        </HeroButton>
                    </div>
                </PopoverContent>
            </Popover>
            <Skeleton className="mt-1 rounded-md" isLoaded={!isLoading}>
                <p className="text-sm pl-2 pr-3 font-semibold">
                    {data?.clientName}
                </p>
            </Skeleton>
        </div>
    )
}
export default ClientName
