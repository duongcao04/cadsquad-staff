'use client'

import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import { Image } from 'antd'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import DueToField from '../../../onboarding/components/data-fields/DueToField'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import { Link } from '@/i18n/navigation'
import { handleCopy } from '@/shared/components/ui/copy-button'
import { addToast } from '@heroui/react'
import { Clock2 } from 'lucide-react'

type Props = {
    data: Job
}
export default function JobCard({ data }: Props) {
    return (
        <div className="grid grid-cols-[400px_1fr_1fr_1fr_1fr_40px] gap-3 items-center border-1 rounded-lg px-6 pt-3 pb-5 border-text3 bg-background hover:bg-background2">
            <div className="flex items-center justify-start gap-3">
                <Image
                    src={String(data.status.thumbnailUrl)}
                    alt={data.displayName}
                    rootClassName="!size-16 rounded-full"
                    className="!size-full rounded-full"
                    preview={false}
                />
                <div>
                    <button
                        className="text-sm text-text2 cursor-pointer hover:underline underline-offset-2"
                        title="Sao chép job number"
                        onClick={() => {
                            try {
                                handleCopy(`#${data.no}`)
                                addToast({
                                    title: 'Sao chép job number thành công',
                                    color: 'success',
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }}
                    >
                        #{data.no}
                    </button>
                    <Link
                        href={`/onboarding/${data.no}`}
                        className="block font-semibold link"
                        target="_blank"
                    >
                        {data.displayName}
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xs text-text2">Client name</p>
                <p className="text-sm font-semibold text-center">
                    {data.clientName}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xs text-text2">Staff cost</p>
                <p className="font-semibold text-red-500">
                    {formatCurrencyVND(data.staffCost)}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5">
                <p className="text-xs text-text2">Due in</p>
                <p className="font-semibold !text-sm flex items-center justify-center gap-2">
                    <Clock2 size={14} className="text-text1p5" />
                    <DueToField data={data.dueAt} />
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xs text-text2">Status</p>
                <p className="font-semibold text-red-500">
                    <JobStatusChip data={data.status} />
                </p>
            </div>
            <Link
                className="text-success text-sm font-semibold hover:underline underline-offset-2 text-end"
                href={`/onboarding/${data.no}`}
                target="_blank"
            >
                View
            </Link>
        </div>
    )
}
