'use client'

import React, { useState } from 'react'

import {
    addToast,
    Avatar,
    AvatarGroup,
    Button,
    Spinner,
    Tab,
    Tabs,
    Tooltip,
} from '@heroui/react'
import { Drawer, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ArrowLeft, ChevronUp, Link2 } from 'lucide-react'

import { formatCurrencyVND } from '@/lib/formatCurrency'

import { useDetailModal } from './actions'
import { useChangeStatusMutation, useJobDetail } from '@/queries/useJob'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { JobStatus } from '@/validationSchemas/job.schema'
import { Link } from '@/i18n/navigation'
import { useJobStatusDetail } from '@/queries/useJobStatus'
import { lightenHexColor } from '@/lib/utils'
import WorkLogTab from './_components/WorkLogTab'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'

export default function JobDetailDrawer() {
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { isOpen, closeModal, jobNo } = useDetailModal()

    const [showFullAssignee, setShowFullAssignee] = useState(false)

    const { job, isLoading, error } = useJobDetail(jobNo)
    const { jobStatus: prevStatus } = useJobStatusDetail(
        job?.status.prevStatusId?.toString()
    )
    const { jobStatus: nextStatus } = useJobStatusDetail(
        job?.status.nextStatusId?.toString()
    )

    const handleChangeStatus = async (nextStatus: JobStatus) => {
        try {
            await changeStatusMutation(
                {
                    jobId: String(job?.id),
                    changeStatusInput: {
                        fromStatusId: String(job?.status.id),
                        toStatusId: String(nextStatus.id),
                    },
                },
                {
                    onSuccess: () => {
                        addToast({
                            title: 'Cập nhật trạng thái thành công',
                            color: 'success',
                        })
                    },
                    onError: () => {
                        addToast({
                            title: 'Cập nhật trạng thái thất bại',
                            color: 'danger',
                        })
                    },
                }
            )
        } catch (error) {
            console.log(error)
            addToast({
                title: 'Cập nhật trạng thái thất bại',
                color: 'danger',
            })
        }
    }

    return (
        <Drawer
            open={isOpen}
            title={
                isLoading ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-2">
                            <p className="tracking-wide line-clamp-1">
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
                        display: job?.status.prevStatusId ? 'grid' : 'block',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    {job?.status.prevStatusId && prevStatus && (
                        <Button
                            color="danger"
                            className="w-full font-semibold font-saira"
                            style={{
                                color: prevStatus?.color,
                                backgroundColor: lightenHexColor(
                                    prevStatus?.color as string,
                                    85
                                ),
                            }}
                            onPress={() => {
                                handleChangeStatus(prevStatus)
                            }}
                        >
                            Mark as {prevStatus.title}
                        </Button>
                    )}
                    {job?.status.nextStatusId && nextStatus && (
                        <Button
                            color="danger"
                            className="w-full font-semibold font-saira"
                            style={{
                                color: nextStatus?.color,
                                backgroundColor: lightenHexColor(
                                    nextStatus?.color as string,
                                    90
                                ),
                            }}
                            onPress={() => {
                                handleChangeStatus(nextStatus)
                            }}
                        >
                            Mark as {nextStatus.title}
                        </Button>
                    )}
                    {job && !job?.status.nextStatusId && (
                        <Button
                            color="danger"
                            className="w-full !opacity-100"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: job?.status.color,
                            }}
                        >
                            Finish at 2025/09/01 - 19:06
                        </Button>
                    )}
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
                            <p className="text-sm text-text2">Job name</p>
                            <p className="text-2xl font-semibold text-wrap">
                                {job?.jobName}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <p className="text-sm text-text2">Income</p>
                                <p className="text-base font-semibold text-wrap">
                                    {formatCurrencyVND(
                                        Number(job?.income),
                                        'en-US',
                                        'USD'
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-text2">Staff cost</p>
                                <p className="text-base font-semibold text-wrap">
                                    {formatCurrencyVND(
                                        Number(job?.staffCost),
                                        'vi-VN',
                                        'VND'
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-text2">
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
                            <p className="text-sm text-text2">Client</p>
                            <p className="text-base font-semibold text-wrap">
                                {job?.clientName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-text2">Description</p>
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
                            <p className="text-sm text-text2">Documents (1)</p>
                            <Link
                                href={String(job?.sourceUrl)}
                                className="flex items-center justify-start gap-2 px-3 py-2 mt-2 border rounded-sm w-fit"
                                title="Sharepoint link"
                            >
                                <Link2 size={20} />
                                <p className="font-semibold">Sharepoint link</p>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <p className="text-sm text-text2">Started at</p>
                                <p className="text-base font-semibold text-wrap">
                                    {dayjs
                                        .utc(job?.startedAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-text2">Due at</p>
                                <p className="text-base font-semibold text-wrap">
                                    {dayjs
                                        .utc(job?.dueAt)
                                        .tz('Asia/Ho_Chi_Minh')
                                        .format(DATE_FORMAT)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-text2">Assignee</p>
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
                                        <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-4">
                                            {job?.memberAssign?.map((mem) => {
                                                return (
                                                    <div
                                                        key={mem.id}
                                                        className="flex items-center justify-start gap-3 p-1 pr-4 bg bg-border rounded-3xl"
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
                    <div className="mt-3 space-y-3">
                        <p className="text-lg font-semibold">Activity</p>
                        <Tabs aria-label="Job action tabs">
                            <Tab key="1" title="Work log">
                                <WorkLogTab jobId={job?.id} />
                            </Tab>
                            <Tab key="2" title="Comments" isDisabled></Tab>
                        </Tabs>
                    </div>
                </>
            )}
        </Drawer>
    )
}
