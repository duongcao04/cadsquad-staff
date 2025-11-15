'use client'

import { Link, redirect } from '@/i18n/navigation'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { HeroCopyButton, JobStatusChip } from '@/shared/components'
import { useDevice } from '@/shared/hooks'
import { Job } from '@/shared/interfaces'
import { Skeleton } from '@heroui/react'
import { Image } from 'antd'
import { Clock2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { DueToField } from '../../../../project-center/shared'

type Props = {
    data: Job
    onPress?: () => void
}
function JobCard({ data, onPress }: Props) {
    const locale = useLocale()
    const { isMobile, isTablet } = useDevice()
    const t = useTranslations()
    const jobDetailUrl = `/jobs/${data.no}`

    const clickable = isMobile || isTablet

    return (
        <div
            className="min-w-full w-fit grid grid-cols-[250px_1fr_1fr_1fr] md:grid-cols-[300px_1fr_1fr_1fr] lg:grid-cols-[300px_1fr_1fr_1fr_1fr_40px] gap-3 items-center border-1 rounded-lg px-6 pt-3 pb-5 border-text-muted bg-background hover:bg-background-muted"
            style={{
                cursor: clickable ? 'pointer' : 'default',
            }}
            onClick={() => {
                if (clickable) {
                    redirect({
                        href: jobDetailUrl,
                        locale,
                    })
                    onPress?.()
                }
            }}
        >
            <div className="flex items-center justify-start gap-3">
                <Image
                    src={String(data.status.thumbnailUrl)}
                    alt={data.displayName}
                    rootClassName="!size-16 rounded-full !aspect-square"
                    className="!size-full rounded-full !aspect-square"
                    preview={false}
                />
                <div>
                    <div className="flex items-center justify-start gap-1">
                        <p className="text-sm font-medium line-clamp-1">
                            #{data.no}
                        </p>
                        <HeroCopyButton textValue={data.no} />
                    </div>
                    <Link
                        href={`/project-center/${data.no}`}
                        className="mt-0.5 block font-semibold !line-clamp-1"
                        title="View detail"
                        target="_blank"
                    >
                        {data.displayName}
                    </Link>
                </div>
            </div>
            <div className="hidden lg:flex flex-col items-center justify-center gap-1">
                <p className="text-xs text-text-subdued">
                    {t('jobColumns.clientName')}
                </p>
                <p className="text-sm font-semibold text-center">
                    {data.clientName}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xs text-text-subdued">
                    {t('jobColumns.staffCost')}
                </p>
                <p className="font-bold text-currency">
                    {formatCurrencyVND(data.staffCost)}
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5">
                <p className="text-xs  text-text-subdued">
                    {t('jobColumns.dueAt')}
                </p>
                <p className="font-semibold text-sm flex items-center justify-center">
                    <Clock2 size={14} className="text-text-subdued" />
                    <DueToField data={data.dueAt} />
                </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-xs  text-text-subdued">
                    {t('jobColumns.status')}
                </p>
                <JobStatusChip data={data.status} />
            </div>
            <Link
                className="hidden lg:block text-sm font-semibold hover:!underline underline-offset-2 text-end !text-link"
                href={`/project-center/${data.no}`}
                target="_blank"
            >
                {t('view')}
            </Link>
        </div>
    )
}
export default React.memo(JobCard)

export function JobCardSkeleton() {
    return (
        <div className="max-w-full grid grid-cols-[250px_1fr] md:grid-cols-[300px_1fr_1fr] lg:grid-cols-[300px_1fr_1fr_1fr] xl:grid-cols-[300px_1fr_1fr_1fr_1fr_40px] gap-3 items-center border rounded-lg px-6 pt-3 pb-5 border-text-muted bg-background">
            {/* Left: avatar + code + title */}
            <div className="flex items-center justify-start gap-3">
                <Skeleton className="!size-16 rounded-full !aspect-square" />
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-16 rounded-md" />{' '}
                        {/* #code */}
                        <Skeleton className="h-4 w-4 rounded-md" />{' '}
                        {/* copy btn */}
                    </div>
                    <Skeleton className="h-5 w-48 rounded-md" />{' '}
                    {/* job title */}
                </div>
            </div>

            {/* Client (xl only) */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-1">
                <Skeleton className="h-3 w-24 rounded-md" /> {/* label */}
                <Skeleton className="h-5 w-28 rounded-md" /> {/* value */}
            </div>

            {/* Staff cost */}
            <div className="hidden md:flex flex-col items-center justify-center gap-1">
                <Skeleton className="h-3 w-24 rounded-md" /> {/* label */}
                <Skeleton className="h-5 w-24 rounded-md" /> {/* value */}
            </div>

            {/* Due at */}
            <div className="hidden xl:flex flex-col items-center justify-center gap-1">
                <Skeleton className="h-3 w-20 rounded-md" /> {/* label */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-md" />{' '}
                    {/* clock icon box */}
                    <Skeleton className="h-5 w-28 rounded-md" />{' '}
                    {/* due value */}
                </div>
            </div>

            {/* Status chip */}
            <div className="hidden md:flex flex-col items-center justify-center gap-1">
                <Skeleton className="h-3 w-16 rounded-md" /> {/* label */}
                <Skeleton className="h-6 w-24 rounded-full" /> {/* chip */}
            </div>

            {/* View link (xl only) */}
            <div className="hidden xl:flex items-center justify-end">
                <Skeleton className="h-5 w-10 rounded-md" />
            </div>
        </div>
    )
}
