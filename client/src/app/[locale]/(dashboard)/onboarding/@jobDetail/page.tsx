'use client'

import React, { useState } from 'react'

import {
    addToast,
    Avatar,
    AvatarGroup,
    Button,
    Input,
    InputProps,
    NumberInput,
    NumberInputProps,
    Spinner,
    Tab,
    Tabs,
    Textarea,
    TextAreaProps,
    Tooltip,
} from '@heroui/react'
import { Drawer, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ArrowLeft, ChevronUp, EditIcon, Link2, PencilOff } from 'lucide-react'

import { useDetailModal } from './actions'
import { useChangeStatusMutation, useJobDetail } from '@/queries/useJob'
import JobStatusChip from '@/shared/components/customize/JobStatusChip'
import { JobStatus } from '@/types/jobStatus.type'
import { Link } from '@/i18n/navigation'
import { useJobStatusDetail } from '@/queries/useJobStatus'
import { lightenHexColor } from '@/lib/utils'
import WorkLogTab from './_components/WorkLogTab'

dayjs.extend(utc)
dayjs.extend(timezone)

const DATE_FORMAT = 'DD/MM/YYYY'

const description = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis temporibus minima illum dicta fugiat sunt ex quibusdam quos. Quis quisquam ipsa architecto veritatis repellat, dolor nobis veniam odit saepe magnam.
Facilis asperiores molestiae laudantium quos commodi praesentium distinctio expedita officia voluptate repudiandae repellat, voluptates voluptatem ab voluptas deleniti dolorum. Delectus nulla officia iste soluta beatae minus aliquam exercitationem doloribus molestiae.
Hic placeat incidunt earum. Dolorum placeat, vitae sit nam, quaerat aut ipsum voluptatibus suscipit nemo incidunt voluptates dolores dolore. Pariatur magni porro repudiandae perferendis odit? Optio modi perferendis voluptate in!`

export default function JobDetailDrawer() {
    /**
     * Instance hooks
     */
    const [showFullAssignee, setShowFullAssignee] = useState(false)
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { isOpen, closeModal, jobNo, isEditMode, switchMode } =
        useDetailModal()
    /**
     * Fetch data
     */
    const { job, isLoading, error } = useJobDetail(jobNo)
    const { jobStatus: prevStatus } = useJobStatusDetail(
        job?.status.prevStatusId?.toString()
    )
    const { jobStatus: nextStatus } = useJobStatusDetail(
        job?.status.nextStatusId?.toString()
    )
    /**
     * Change status action
     */
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
    /**
     * Input props define
     */
    const inputProps: InputProps = {
        classNames: isEditMode
            ? {}
            : {
                base: 'opacity-100 cursor-text',
                inputWrapper: '!pl-0 bg-transparent shadow-none',
            },
        isDisabled: !isEditMode,
        variant: 'underlined',
    }
    const numberInputProps: NumberInputProps = {
        classNames: isEditMode
            ? {
                base: 'p-0 opacity-100 cursor-text',
                innerWrapper: '!h-6 !pb-0 bg-transparent shadow-none',
                mainWrapper: 'flex items-center',
                inputWrapper: '!h-6 !pl-0 !pt-0 flex items-center',
            }
            : {
                base: 'opacity-100 cursor-text',
                mainWrapper: 'flex items-center',
                inputWrapper: '!h-6 !p-0 pt-1 bg-transparent shadow-none',
            },
        isDisabled: !isEditMode,
        hideStepper: true,
        variant: isEditMode ? 'underlined' : 'flat',
    }
    const textAreaProps: TextAreaProps = {
        classNames: {},
        isDisabled: !isEditMode,
    }

    return (
        <Drawer
            open={isOpen}
            title={
                isLoading ? (
                    <Skeleton paragraph={{ rows: 1 }} />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-3">
                            <p className="tracking-wide line-clamp-1">
                                {jobNo}
                            </p>
                            <div className="h-[20px] w-[1.3px] bg-text3" />
                            {!isLoading && job && (
                                <JobStatusChip
                                    data={job?.status as JobStatus}
                                />
                            )}
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            onPress={() => {
                                if (isEditMode) {
                                    switchMode('view')
                                } else {
                                    switchMode('edit')
                                }
                            }}
                            variant="flat"
                            color="warning"
                        >
                            {isEditMode ? (
                                <PencilOff size={16} />
                            ) : (
                                <EditIcon size={16} />
                            )}
                        </Button>
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
                                    prevStatus?.hexColor as string,
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
                            <Input
                                value={job?.jobName}
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: '500',
                                    textWrap: 'wrap',
                                }}
                                {...inputProps}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <p className="text-sm text-text2">Income</p>
                                <NumberInput
                                    startContent={
                                        <p className="text-base font-semibold">
                                            $
                                        </p>
                                    }
                                    value={parseInt(String(job?.income))}
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: '500',
                                        textWrap: 'wrap',
                                    }}
                                    size="sm"
                                    {...numberInputProps}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-text2">Staff cost</p>
                                <NumberInput
                                    startContent={
                                        <p className="text-base font-semibold underline">
                                            đ
                                        </p>
                                    }
                                    value={parseInt(String(job?.staffCost))}
                                    style={{
                                        fontSize: 'var(--text-base)',
                                        fontWeight: '500',
                                        textWrap: 'wrap',
                                    }}
                                    size="sm"
                                    {...numberInputProps}
                                />
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
                            <Input
                                value={job?.clientName}
                                style={{
                                    fontSize: 'var(--text-base)',
                                    fontWeight: '500',
                                    textWrap: 'wrap',
                                }}
                                size="sm"
                                {...inputProps}
                            />
                        </div>
                        <div>
                            <p className="text-sm text-text2">Description</p>
                            <Textarea
                                value={description}
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    textWrap: 'wrap',
                                }}
                                maxRows={5}
                                {...textAreaProps}
                            />
                            <p className="text-sm text-wrap line-clamp-2">
                                {description}
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
                                <WorkLogTab jobId={job?.id?.toString()} />
                            </Tab>
                            <Tab key="2" title="Comments" isDisabled></Tab>
                        </Tabs>
                    </div>
                </>
            )}
        </Drawer>
    )
}
