'use client'

import { use } from 'react'
import React from 'react'
import PageHeading from '../../_components/PageHeading'

import PageBreadcrumbs from './_components/PageBreadcrumbs'
import { useJobByNo } from '@/shared/queries/useJob'
import { addToast } from '@heroui/react'
import { Skeleton, Input, Tooltip, Button } from '@heroui/react'
import { Copy, Clock9 } from 'lucide-react'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import PaidChip from '@/shared/components/chips/PaidChip'
import { Job } from '@/shared/interfaces/job.interface'
import JobDetailSection from '../../_components/JobDetailSection'
import ActionsDropdown from '../@jobDetail/_components/dropdowns/ActionsDropdown'
import DueToField from '../components/data-fields/DueToField'
import { Image } from 'antd'

export default function JobDetailPage({
    params,
}: {
    params: Promise<{ jobNo: string }>
}) {
    const { jobNo } = use(params)

    const { job, isLoading } = useJobByNo(jobNo)
    const isEditMode = false
    return (
        <>
            <PageHeading title="Onboarding" />
            <div className="ml-2 pb-3">
                <PageBreadcrumbs jobNo={jobNo} />
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
                                                    <p className="align-bottom text-lg text-text2 font-normal underline-offset-2 tracking-wider line-clamp-1">
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
                                {/* {userRole === RoleEnum.ADMIN && (
                                    <Button size="sm" variant="solid">
                                        <p className="text-sm font-medium">
                                            Edit
                                        </p>
                                    </Button>
                                )} */}
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
                                                        'onboarding' +
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
                                            className="text-text-fore2"
                                        />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Actions">
                                    <ActionsDropdown
                                        data={job as Job}
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
                                    <DueToField
                                        data={job?.dueAt ?? new Date()}
                                    />
                                </div>
                                <Clock9 size={16} />
                            </div>
                        </div>
                    </div>
                    <hr className="text-text3 my-8" />
                    <JobDetailSection jobNo={jobNo} />
                    <div className="h-32" />
                </>
            </div>
        </>
    )
}
