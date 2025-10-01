'use client'

import TextClamp from '@/shared/components/texts/TextClamp'
import { Job } from '@/shared/interfaces/job.interface'
import { useUpdateJobMutation } from '@/shared/queries/useJob'
import {
    Skeleton,
    useDisclosure,
} from '@heroui/react'
import { Settings } from 'lucide-react'
import { useState } from 'react'

const Description = ({
    isLoading = false,
    data,
}: {
    isLoading: boolean
    data: Job
}) => {
    const { mutateAsync: updateJobMutation, isPending: isUpdating } =
        useUpdateJobMutation()
    const { isOpen, onClose, onOpen } = useDisclosure({
        id: 'Description',
    })
    const [value, setValue] = useState(data?.clientName)
    return (
        <div className="w-full">
            <Skeleton className="w-full h-fit rounded-md" isLoaded={!isLoading}>
                <button className="w-full pl-2 pr-3 py-1.5 rounded-lg hover:bg-background2 flex items-center justify-between cursor-pointer">
                    <p className="text-xs text-text2">Description</p>
                    <Settings size={16} />
                </button>
            </Skeleton>
            <Skeleton
                className="pl-2 pr-3 mt-1 rounded-md"
                isLoaded={!isLoading}
            >
                <TextClamp>{data?.description}</TextClamp>
            </Skeleton>
        </div>
    )
}
export default Description
