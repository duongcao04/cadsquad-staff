'use client'

import React, { useState } from 'react'

import { Avatar, AvatarGroup, Button, Spinner, Tooltip } from '@heroui/react'
import { Drawer, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
    Banknote,
    CalendarClock,
    CalendarPlus,
    ChevronUp,
    CircleDollarSign,
    FolderIcon,
    HandCoins,
    Link as LinkIcon,
    Loader,
    Users,
} from 'lucide-react'
import Link from 'next/link'

import { formatCurrencyVND } from '@/lib/formatCurrency'

import DetailTabs from './_components/DetailTabs'
import { useDetailModal } from './actions'
import { useJobDetail } from '@/queries/useJob'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { JobStatus } from '@/validationSchemas/job.schema'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'

export default function JobDetailDrawer() {
    const { isOpen, closeModal, jobNo } = useDetailModal()

    const [showFullAssignee, setShowFullAssignee] = useState(false)

    const { job, isLoading, error } = useJobDetail(jobNo)

    console.log(error)

    return (
        <Drawer
            open={isOpen}
            title={
                isLoading ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-2">
                            <p className="line-clamp-1 tracking-wide">
                                # {jobNo}
                            </p>
                        </div>
                    </div>
                )
            }
            width={700}
            maskClosable
            classNames={{
                mask: '!backdrop-brightness-50',
            }}
            mask={true}
            onClose={closeModal}
        >
            {isLoading && <Spinner />}
            {!isLoading && error && <p>{JSON.stringify(error)}</p>}
            {!isLoading && !error && (
                <>
                    <p className="text-2xl font-semibold text-wrap">
                        {job?.jobName}
                    </p>
                    <div className="mt-7 space-y-4 text-base">
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Loader size={16} />
                                <p className="font-normal line-clamp-1">
                                    Status
                                </p>
                            </div>
                            {job && (
                                <JobStatusChip
                                    data={job?.jobStatus as JobStatus}
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CalendarPlus size={16} />
                                <p className="font-normal line-clamp-1">
                                    Started at
                                </p>
                            </div>
                            <p className="font-semibold">
                                {dayjs
                                    .utc(job?.startedAt)
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format(DATE_FORMAT)}
                            </p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CalendarClock size={16} />
                                <p className="font-normal line-clamp-1">
                                    Due to
                                </p>
                            </div>
                            <p className="font-semibold">
                                {dayjs
                                    .utc(job?.dueAt)
                                    .tz('Asia/Ho_Chi_Minh')
                                    .format(DATE_FORMAT)}
                            </p>
                        </div>
                        <div
                            className={`grid grid-cols-[0.5fr_1fr] ${
                                showFullAssignee && 'pt-1 items-start'
                            }`}
                        >
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Users size={16} />
                                <p className="font-normal line-clamp-1">
                                    Assignee
                                </p>
                            </div>
                            <div className="w-full">
                                {!showFullAssignee ? (
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
                                        onClick={() =>
                                            setShowFullAssignee(true)
                                        }
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
                                ) : (
                                    <div className="grid grid-cols-[1fr_32px] gap-4">
                                        <div className="flex items-center justify-start flex-wrap gap-x-3 gap-y-4">
                                            {job?.memberAssign?.map((mem) => {
                                                return (
                                                    <div
                                                        key={mem.id}
                                                        className="flex items-center justify-start gap-3 bg bg-border p-1 rounded-3xl pr-4"
                                                    >
                                                        <Avatar
                                                            size="sm"
                                                            src={mem.avatar!}
                                                            classNames={{
                                                                img: 'opacity-100',
                                                            }}
                                                            isBordered
                                                            showFallback
                                                        />
                                                        <p className="text-sm">
                                                            {mem.name}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <Tooltip
                                            content="Hidden"
                                            color="primary"
                                        >
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={() =>
                                                    setShowFullAssignee(false)
                                                }
                                            >
                                                <ChevronUp />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr className="opacity-10" />
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <Banknote size={18} />
                                <p className="font-normal line-clamp-1">
                                    Payment Channel
                                </p>
                            </div>
                            <p className="font-semibold">ACB</p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <CircleDollarSign size={16} />
                                <p className="font-normal line-clamp-1">
                                    Income
                                </p>
                            </div>
                            <p className="font-semibold">
                                {formatCurrencyVND(20, 'en-US', 'USD')}
                            </p>
                        </div>
                        <div className="grid grid-cols-[0.5fr_1fr]">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <HandCoins size={16} />
                                <p className="font-normal line-clamp-1">
                                    Staff Cost
                                </p>
                            </div>
                            <p className="font-semibold text-lg text-danger">
                                {formatCurrencyVND(500000, 'vi-VN', 'VND')}
                            </p>
                        </div>
                        <hr className="opacity-10" />
                        <div className="space-y-3">
                            <div className="flex items-center justify-start gap-2 opacity-80">
                                <LinkIcon size={16} />
                                <p className="font-normal line-clamp-1">
                                    Sharepoint Link (1)
                                </p>
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
                        <div className="mt-4">
                            <DetailTabs />
                        </div>
                    </div>
                </>
            )}
        </Drawer>
    )
}
