'use client'

import React from 'react'
import { useJobDetail } from '@/shared/queries/useJob'
import { Tag } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Avatar, AvatarGroup, Tooltip } from '@heroui/react'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { Link } from '@/i18n/navigation'
import { FolderIcon, Link as LinkIcon } from 'lucide-react'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'
type Props = {
    jobNo?: string
}
export default function DetailTab({ jobNo }: Props) {
    const { job } = useJobDetail(jobNo)

    return (
        <div className="bg-background2 min-h-[600px] px-8 py-6 rounded-b-2xl">
            <div className="flex items-center justify-between">
                <h1 className="text-base font-medium px-1.5 text-text1p5">
                    #{job?.jobNo}
                </h1>
                <div></div>
            </div>
            <div className="mt-8 grid grid-cols-[1fr_0.5fr] gap-8">
                <div>
                    <h2 className="text-xl font-semibold">{job?.jobName}</h2>
                    {!job?.description && (
                        <div className="mt-2.5">
                            <p className="font-medium">Description</p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Maxime vero, ullam culpa quia
                                ipsa voluptatum! Numquam exercitationem nemo
                                ipsa voluptas praesentium soluta, modi repellat
                                sunt omnis iusto provident quasi dolor!
                            </p>
                        </div>
                    )}

                    <div className="h-[1px] w-full bg-border my-5" />
                    <div className="space-y-3">
                        <div className="flex items-center justify-start gap-2">
                            <LinkIcon size={16} />
                            <p className="font-medium">Sharepoint Link (1)</p>
                        </div>
                        <Link
                            href={job?.sourceUrl ?? '#'}
                            target="_blank"
                            className="border border-border w-fit px-3 py-2 rounded-lg grid grid-cols-[30px_1fr] gap-4 items-center max-w-[40%]"
                        >
                            <FolderIcon size={30} strokeWidth={1.4} />
                            <div>
                                <p className="text-sm font-medium line-clamp-1">
                                    {job?.jobNo} - {job?.jobName}
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="h-[1px] w-full bg-border my-5" />
                    <div className="space-y-3">
                        <p className="font-medium">Activity</p>
                    </div>
                </div>
                <div>
                    <Tag color={job?.status.color}>{job?.status.title}</Tag>
                    <div className="mt-5 rounded-lg border border-border p-3">
                        <h2 className="text-lg font-semibold">Detail</h2>
                        <div className="h-[1px] w-full bg-border my-2" />
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-[100px_1fr] gap-8 text-base">
                                <p className="text-text1p5">Assignee</p>
                                <AvatarGroup
                                    size="sm"
                                    max={5}
                                    total={
                                        job?.memberAssign &&
                                        job?.memberAssign.length - 5
                                    }
                                    isBordered
                                    classNames={{
                                        base: 'cursor-pointer',
                                    }}
                                >
                                    {job?.memberAssign?.map((mem) => {
                                        return (
                                            <Tooltip
                                                key={mem.id}
                                                content={mem?.name}
                                                classNames={{
                                                    content:
                                                        'max-w-fit text-nowrap',
                                                }}
                                            >
                                                <Avatar
                                                    src={mem?.avatar ?? ''}
                                                    classNames={{
                                                        base: 'data-[hover=true]:-translate-x-0 rtl:data-[hover=true]:translate-x-0 cursor-pointer',
                                                    }}
                                                    showFallback
                                                />
                                            </Tooltip>
                                        )
                                    })}
                                </AvatarGroup>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-8 text-base">
                                <p className="text-text1p5">Started at</p>
                                <p className="font-medium">
                                    {dayjs
                                        .utc(job?.startedAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-8 text-base">
                                <p className="text-text1p5">Due to</p>
                                <p className="font-medium">
                                    {dayjs
                                        .utc(job?.deletedAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-8 text-base">
                                <p className="text-text1p5">Completed at</p>
                                <p className="font-medium">
                                    {dayjs
                                        .utc(job?.completedAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-border my-3" />
                        <div className="space-y-3">
                            <div className="grid grid-cols-[100px_1fr] gap-8 text-base">
                                <p className="text-text1p5">Staff cost</p>
                                <p className="font-medium text-danger">
                                    {formatCurrencyVND(Number(job?.staffCost))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
