'use client'

import React, { useState } from 'react'

import { Avatar, AvatarGroup, Button, Spinner, Tooltip } from '@heroui/react'
import { Drawer, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ArrowLeft, ChevronUp, Link2 } from 'lucide-react'

import { formatCurrencyVND } from '@/lib/formatCurrency'

import JobActivityTabs from './_components/JobActivityTabs'
import { useDetailModal } from './actions'
import { useJobDetail } from '@/queries/useJob'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { JobStatus } from '@/validationSchemas/job.schema'
import { Link } from '@/i18n/navigation'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'

export default function JobDetailDrawer() {
    const { isOpen, closeModal, jobNo } = useDetailModal()

    const [showFullAssignee, setShowFullAssignee] = useState(false)

    const { job, isLoading, error } = useJobDetail(jobNo)

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
                                {jobNo}
                            </p>
                        </div>
                        {!isLoading && job && (
                            <JobStatusChip data={job?.status as JobStatus} />
                        )}
                    </div>
                )
            }
            footer={
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    <Button color="danger">Mark as Revision</Button>
                    <Button color="success">Mark as Completed</Button>
                </div>
            }
            width={500}
            maskClosable
            mask={true}
            closeIcon={<ArrowLeft size={16} />}
            onClose={closeModal}
        >
            {isLoading && <Spinner />}
            {!isLoading && error && <p>{JSON.stringify(error)}</p>}
            {!isLoading && !error && (
                <>
                    <div className="space-y-3">
                        <div>
                            <p className="text-text2 text-sm">Job name</p>
                            <p className="text-2xl font-semibold text-wrap">
                                {job?.jobName}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <p className="text-text2 text-sm">Income</p>
                                <p className="text-base font-semibold text-wrap">
                                    {formatCurrencyVND(
                                        Number(job?.income),
                                        'en-US',
                                        'USD'
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-text2 text-sm">Staff cost</p>
                                <p className="text-base font-semibold text-wrap">
                                    {formatCurrencyVND(
                                        Number(job?.staffCost),
                                        'vi-VN',
                                        'VND'
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-text2 text-sm">
                                    Payment Channel
                                </p>
                                <p className="text-base font-semibold text-wrap">
                                    {job?.paymentChannel.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5 text-text3" />
                    <div className="space-y-3.5">
                        <p className="text-lg font-semibold">Details</p>
                        <div>
                            <p className="text-text2 text-sm">Client</p>
                            <p className="text-base font-semibold text-wrap">
                                {job?.clientName}
                            </p>
                        </div>
                        <div>
                            <p className="text-text2 text-sm">Description</p>
                            <p className="text-sm text-wrap line-clamp-2">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. A aspernatur voluptatibus
                                commodi expedita, reprehenderit voluptate unde
                                perspiciatis odit nam. Aliquam, nemo fugit rerum
                                iure ducimus tempora ipsum at iusto maxime!
                                Expedita laboriosam iusto vero fuga accusamus
                                quibusdam excepturi ratione doloribus deserunt
                                fugit velit, saepe molestias eligendi quas
                                voluptatibus optio odit cumque vitae, officiis
                                molestiae eos error! Rem nam nesciunt ut?
                                Doloremque iure eligendi tenetur numquam?
                                Voluptatem, magnam corporis, totam ea facilis
                                expedita voluptatum voluptates quos mollitia
                                aliquam recusandae modi iste fuga maxime quae
                                unde? Modi eveniet necessitatibus aspernatur
                                laudantium veritatis?
                            </p>
                        </div>
                        <div>
                            <p className="text-text2 text-sm">Documents (1)</p>
                            <Link
                                href={String(job?.sourceUrl)}
                                className="mt-2 flex items-center justify-start gap-2 border w-fit px-3 py-2 rounded-sm"
                                title="Sharepoint link"
                            >
                                <Link2 size={20} />
                                <p className="font-semibold">Sharepoint link</p>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <p className="text-text2 text-sm">Started at</p>
                                <p className="text-base font-semibold text-wrap">
                                    {dayjs
                                        .utc(job?.startedAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                            <div>
                                <p className="text-text2 text-sm">Due at</p>
                                <p className="text-base font-semibold text-wrap">
                                    {dayjs
                                        .utc(job?.dueAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-text2 text-sm">Assignee</p>
                            <div className="px-2.5 mt-3.5 w-full">
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
                    </div>
                    <hr className="mt-7 text-text3" />
                    <div className="mt-3 space-y-2">
                        <p className="text-lg font-semibold">Activity</p>
                        <JobActivityTabs />
                    </div>
                </>
            )}
        </Drawer>
    )
}
