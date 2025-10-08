import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import { Image } from 'antd'
import { ChevronRight } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

type Props = {
    data: Job
    onClose: () => void
}

export default function JobCard({ data, onClose }: Props) {
    const router = useRouter()
    return (
        <button
            onClick={() => {
                router.push(`/project-center/${data.no}`)
                onClose()
            }}
            className="bg-background2 size-full rounded-md px-4 py-3 flex items-center justify-between hover:bg-primary hover:text-white transition duration-50 cursor-pointer"
        >
            <div className="flex items-center justify-start gap-3">
                <Image
                    src={String(data.status.thumbnailUrl)}
                    alt={data.displayName}
                    rootClassName="size-12 rounded-full"
                    className="size-12 rounded-full"
                    preview={false}
                />
                <div className="space-y-0.5 text-left">
                    <p className="text-xs">#{data.no}</p>
                    <p className="text-sm font-medium">{data.displayName}</p>
                </div>
            </div>
            <ChevronRight size={16} />
        </button>
    )
}
