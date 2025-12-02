'use client'

import { use } from 'react'

import { JobStatusChip, PageHeading, PaidChip } from '@/shared/components'
import { useProfile } from '@/lib/queries/useAuth'
import { useJobByNo } from '@/lib/queries/useJob'
import { addToast, Button, Input, Skeleton, Tooltip } from '@heroui/react'
import { Image } from 'antd'
import { Clock9, Copy, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
    ActionsDropdown,
    JobDetailSection,
} from '../../project-center/@jobDetail/shared'
import { DueToView } from '../../../../../../shared/components/project-center/DueToView'
import { TJob } from '../../../../../../shared/types'

export default function JobDetailPage({
    params,
}: {
    params: Promise<{ jobNo: string }>
}) {
    const t = useTranslations()
    const { isAdmin } = useProfile()
    const { jobNo } = use(params)

    const { job, isLoading } = useJobByNo(jobNo)
    const isEditMode = false
    return (
        <>
            <PageHeading title={t('projectCenter')} />
            <div className="ml-2 pb-3">
                {/* <PageBreadcrumbs jobNo={jobNo} /> */}
            </div>
            <div className="size-full bg-background py-4 px-6 rounded-md w-full h-[calc(100%-54px-32px-12px)] overflow-y-auto">
                <>
                    <div className="space-y-2">
                        <div className="grid grid-cols-[1fr_170px] items-start gap-2">
                            <div className="w-full space-y-2.5">
                                <div className="w-full flex items-center justify-start gap-2">
                                    <Skeleton
                                        className="w-full h-full rounded-md"
                                        isLoaded={!isLoading}
                                    >
                                        {!isEditMode ? (
                                            <div className="flex items-center justify-start gap-4">
                                                <Image
                                                    preview={false}
                                                    alt={job?.displayName}
                                                    src={String(
                                                        job?.status.thumbnailUrl
                                                    )}
                                                    rootClassName="size-20 rounded-full"
                                                    className="!size-full rounded-full"
                                                />
                                                <div>
                                                    <p className="align-bottom text-lg text-text-muted font-normal underline-offset-2 tracking-wider line-clamp-1">
                                                        #{job?.no}
                                                    </p>
                                                    <p className="align-bottom text-3xl font-semibold">
                                                        {job?.displayName}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <Input
                                                value={job?.displayName}
                                                style={{
                                                    fontSize: 'var(--text-2xl)',
                                                    fontWeight: '500',
                                                    textWrap: 'wrap',
                                                }}
                                                variant="underlined"
                                            />
                                        )}
                                    </Skeleton>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-end gap-2">
                                {isAdmin && (
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        startContent={<Settings size={12} />}
                                        color="warning"
                                    >
                                        <p className="text-sm font-medium">
                                            {t('edit')}
                                        </p>
                                    </Button>
                                )}
                                <Tooltip content="Copy link">
                                    <Button
                                        variant="light"
                                        color="primary"
                                        onPress={() => {
                                            navigator.clipboard
                                                .writeText(
                                                    String(
                                                        process.env
                                                            .NEXT_PUBLIC_URL
                                                    ) +
                                                        '/' +
                                                        'project-center' +
                                                        '/' +
                                                        job?.no
                                                )
                                                .then(() => {
                                                    addToast({
                                                        title: 'Copy job no successful',
                                                        color: 'success',
                                                    })
                                                })
                                                .catch((err) => {
                                                    console.log(err)
                                                    addToast({
                                                        title: 'Copy job no fail',
                                                        color: 'danger',
                                                    })
                                                })
                                        }}
                                        className="flex items-center justify-center"
                                        size="sm"
                                        isIconOnly
                                    >
                                        <Copy
                                            size={18}
                                            className="text-text-subdued"
                                        />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Actions">
                                    <ActionsDropdown
                                        data={job as TJob}
                                        jobNo={jobNo as string}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="mt-4 w-full flex items-center justify-between gap-3">
                            <div className="flex items-center justify-start gap-4">
                                <Skeleton
                                    className="w-fit h-[24px] rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <div className="w-full h-full">
                                        {job?.status && (
                                            <JobStatusChip data={job.status} />
                                        )}
                                    </div>
                                </Skeleton>
                                <Skeleton
                                    className="w-fit h-[24px] rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <div className="w-full h-full">
                                        <PaidChip
                                            status={
                                                job?.isPaid ? 'paid' : 'unpaid'
                                            }
                                        />
                                    </div>
                                </Skeleton>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <div className="text-sm font-medium">
                                    <DueToView
                                        data={job?.dueAt ?? new Date()}
                                    />
                                </div>
                                <Clock9 size={16} />
                            </div>
                        </div>
                    </div>
                    <hr className="text-text-muted my-8" />
                    <JobDetailSection data={job} />
                    <div className="h-32" />
                </>
            </div>
        </>
    )
}
