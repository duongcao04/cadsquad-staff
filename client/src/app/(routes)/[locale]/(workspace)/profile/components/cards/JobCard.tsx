'use client'

import React from 'react'
import { Job } from '@/shared/interfaces/job.interface'
import { Image } from 'antd'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import DueToField from '../../../project-center/components/data-fields/DueToField'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import { Link } from '@/i18n/navigation'
import { handleCopy } from '@/shared/components/ui/copy-button'
import { addToast, Skeleton } from '@heroui/react'
import { Clock2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
    data: Job
    isLoading?: boolean
}
function JobCard({ data, isLoading = false }: Props) {
    const t = useTranslations()
    return (
        <div className="grid grid-cols-[400px_1fr_1fr_1fr_1fr_40px] gap-3 items-center border-1 rounded-lg px-6 pt-3 pb-5 border-text3 bg-background hover:bg-background2">
            <div className="flex items-center justify-start gap-3">
                <Skeleton
                    isLoaded={!isLoading}
                    className="size-16 rounded-full"
                >
                    <Image
                        src={String(data.status.thumbnailUrl)}
                        alt={data.displayName}
                        rootClassName="!size-16 rounded-full"
                        className="!size-full rounded-full"
                        preview={false}
                    />
                </Skeleton>
                <div>
                    <Skeleton
                        isLoaded={!isLoading}
                        className="size-fit rounded-md"
                    >
                        <button
                            className="text-sm text-text2 cursor-pointer hover:underline underline-offset-2"
                            title={t('copiedToClipboard')}
                            onClick={() => {
                                try {
                                    handleCopy(`#${data.no}`)
                                    addToast({
                                        title: t('copiedToClipboard'),
                                        color: 'success',
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }}
                        >
                            #{data.no}
                        </button>
                    </Skeleton>
                    <Skeleton
                        isLoaded={!isLoading}
                        className="mt-0.5 size-fit rounded-md"
                    >
                        <Link
                            href={`/project-center/${data.no}`}
                            className="block font-semibold link"
                            target="_blank"
                        >
                            {data.displayName}
                        </Link>
                    </Skeleton>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="text-xs text-text2">
                        {t('jobColumns.clientName')}
                    </p>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="text-sm font-semibold text-center">
                        {data.clientName}
                    </p>
                </Skeleton>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="text-xs text-text2">
                        {t('jobColumns.staffCost')}
                    </p>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="font-bold text-currency">
                        {formatCurrencyVND(data.staffCost)}
                    </p>
                </Skeleton>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5">
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="text-xs text-text2">
                        {t('jobColumns.dueAt')}
                    </p>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="font-semibold !text-sm flex items-center justify-center gap-2">
                        <Clock2 size={14} className="text-text1p5" />
                        <DueToField data={data.dueAt} />
                    </p>
                </Skeleton>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <p className="text-xs text-text2">
                        {t('jobColumns.status')}
                    </p>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                    <JobStatusChip data={data.status} />
                </Skeleton>
            </div>
            <Skeleton isLoaded={!isLoading} className="size-fit rounded-md">
                <Link
                    className="text-success text-sm font-semibold hover:underline underline-offset-2 text-end"
                    href={`/project-center/${data.no}`}
                    target="_blank"
                >
                    {t('view')}
                </Link>
            </Skeleton>
        </div>
    )
}
export default React.memo(JobCard)
