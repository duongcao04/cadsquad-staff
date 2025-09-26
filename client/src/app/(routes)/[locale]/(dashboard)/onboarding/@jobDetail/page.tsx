'use client'

import React, { useState } from 'react'

import {
    addToast,
    Avatar,
    AvatarGroup,
    Button,
    DatePicker,
    Input,
    InputProps,
    NumberInput,
    NumberInputProps,
    Skeleton,
    Tab,
    Tabs,
    Textarea,
    TextAreaProps,
    Tooltip,
} from '@heroui/react'
import { Drawer, Select } from 'antd'
import {
    ArrowLeft,
    ChevronUp,
    EditIcon,
    Link2,
    MoveDiagonal,
    PencilOff,
} from 'lucide-react'

import { useDetailModal } from './actions'
import { useChangeStatusMutation, useJobByNo } from '@/shared/queries/useJob'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import { useJobStatusByOrder } from '@/shared/queries/useJobStatus'
import { lightenHexColor } from '@/lib/utils'
import WorkLogTab from './_components/WorkLogTab'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { VietnamDateFormat } from '@/lib/dayjs'
import { Link } from '@/i18n/navigation'
import useAuth from '@/shared/queries/useAuth'
import { RoleEnum } from '@/shared/enums/role.enum'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import TextClamp from '@/shared/components/texts/TextClamp'
import { parseDate } from '@internationalized/date'

const description = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis temporibus minima illum dicta fugiat sunt ex quibusdam quos. Quis quisquam ipsa architecto veritatis repellat, dolor nobis veniam odit saepe magnam.
Facilis asperiores molestiae laudantium quos commodi praesentium distinctio expedita officia voluptate repudiandae repellat, voluptates voluptatem ab voluptas deleniti dolorum. Delectus nulla officia iste soluta beatae minus aliquam exercitationem doloribus molestiae.
Hic placeat incidunt earum. Dolorum placeat, vitae sit nam, quaerat aut ipsum voluptatibus suscipit nemo incidunt voluptates dolores dolore. Pariatur magni porro repudiandae perferendis odit? Optio modi perferendis voluptate in!`

export const EmptyAttachments = ({ isEditMode }: { isEditMode: boolean }) => {
    if (!isEditMode) {
        return <p>No attachments available.</p>
    }
    return (
        <p className="underline text-blue-500 underline-offset-2 cursor-pointer">
            Add attachment
        </p>
    )
}

export default function JobDetailDrawer() {
    const { userRole } = useAuth()
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
    const { job, isLoading, error } = useJobByNo(jobNo)
    const { data: paymentChannels } = usePaymentChannels()
    const { jobStatus: prevStatus } = useJobStatusByOrder(
        job?.status.prevStatusOrder
    )
    const { jobStatus: nextStatus } = useJobStatusByOrder(
        job?.status.nextStatusOrder
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
        isDisabled: !isEditMode,
        variant: 'underlined',
    }
    const numberInputProps: NumberInputProps = {
        classNames: {
            inputWrapper: 'h-[20px]',
        },
        isDisabled: !isEditMode,
        hideStepper: true,
        variant: 'underlined',
    }
    const textAreaProps: TextAreaProps = {
        classNames: {},
        isDisabled: !isEditMode,
    }

    return (
        <Drawer
            open={isOpen}
            title={
                <div className="flex items-center justify-between">
                    <div className="grid grid-cols-[minmax(80px,max-content)_2px_1fr] items-center gap-3">
                        <Skeleton
                            className="w-full h-full rounded-md"
                            isLoaded={!isLoading}
                        >
                            <p className="tracking-wide line-clamp-1">
                                {jobNo}
                            </p>
                        </Skeleton>
                        <div className="h-[20px] w-[1.3px] bg-text3" />
                        <Skeleton
                            className="min-w-[150px] h-[24px] rounded-md"
                            isLoaded={!isLoading}
                        >
                            <div className="w-full h-full">
                                {job?.status && (
                                    <JobStatusChip data={job.status} />
                                )}
                            </div>
                        </Skeleton>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        {userRole === RoleEnum.ADMIN && (
                            <Skeleton
                                className="w-8 h-8 rounded-md"
                                isLoaded={!isLoading}
                            >
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
                            </Skeleton>
                        )}
                        <Skeleton
                            className="w-8 h-8 rounded-md"
                            isLoaded={!isLoading}
                        >
                            <Tooltip content="Tính năng đang được phát triển">
                                <div
                                    className="cursor-pointer"
                                    title="Fullscreen"
                                >
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        title="Fullscreen"
                                        isDisabled
                                    >
                                        <MoveDiagonal size={16} />
                                    </Button>
                                </div>
                            </Tooltip>
                        </Skeleton>
                    </div>
                </div>
            }
            footer={
                <div
                    style={{
                        display: job?.status.prevStatusOrder ? 'grid' : 'block',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    {job?.status.prevStatusOrder && prevStatus && (
                        <Button
                            color="danger"
                            className="w-full font-semibold font-saira"
                            style={{
                                color: prevStatus?.hexColor,
                                backgroundColor: lightenHexColor(
                                    prevStatus?.hexColor,
                                    85
                                ),
                            }}
                            onPress={() => {
                                handleChangeStatus(prevStatus)
                            }}
                        >
                            Mark as {prevStatus.displayName}
                        </Button>
                    )}
                    {job?.status.nextStatusOrder && nextStatus && (
                        <Button
                            color="danger"
                            className="w-full font-semibold font-saira"
                            style={{
                                color: nextStatus?.hexColor,
                                backgroundColor: lightenHexColor(
                                    nextStatus?.hexColor,
                                    90
                                ),
                            }}
                            onPress={() => {
                                handleChangeStatus(nextStatus)
                            }}
                        >
                            Mark as {nextStatus.displayName}
                        </Button>
                    )}
                    {job && !job?.status.nextStatusOrder && (
                        <Button
                            color="danger"
                            className="w-full !opacity-100"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: job?.status.hexColor,
                            }}
                        >
                            Finish at 2025/09/01 - 19:06
                        </Button>
                    )}
                </div>
            }
            width={600}
            maskClosable
            mask={true}
            closeIcon={<ArrowLeft size={16} />}
            onClose={closeModal}
        >
            {error ? (
                <p>{JSON.stringify(error)}</p>
            ) : (
                <>
                    <div className="space-y-3">
                        <div>
                            <Skeleton
                                className="w-fit h-fit rounded-md"
                                isLoaded={!isLoading}
                            >
                                <p className="text-sm text-text2">Job name</p>
                            </Skeleton>
                            <Skeleton
                                className="w-full mt-1 h-full rounded-md"
                                isLoaded={!isLoading}
                            >
                                {!isEditMode ? (
                                    <p className="text-2xl font-semibold text-wrap">
                                        {job?.displayName}
                                    </p>
                                ) : (
                                    <Input
                                        value={job?.displayName}
                                        style={{
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: '500',
                                            textWrap: 'wrap',
                                        }}
                                        {...inputProps}
                                    />
                                )}
                            </Skeleton>
                        </div>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <Skeleton
                                    className="w-fit h-fit rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <p className="text-sm text-text2">Income</p>
                                </Skeleton>
                                <Skeleton
                                    className="mt-1 rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <p className="text-base font-semibold">
                                            {formatCurrencyVND(
                                                parseInt(
                                                    String(job?.incomeCost)
                                                ),
                                                'en-US',
                                                'USD'
                                            )}
                                        </p>
                                    ) : (
                                        <NumberInput
                                            startContent={
                                                <p className="text-base font-semibold">
                                                    $
                                                </p>
                                            }
                                            size="sm"
                                            value={parseInt(
                                                String(job?.incomeCost)
                                            )}
                                            style={{
                                                fontSize: 'var(--text-base)',
                                                fontWeight: '500',
                                                textWrap: 'wrap',
                                            }}
                                            {...numberInputProps}
                                        />
                                    )}
                                </Skeleton>
                            </div>
                            <div>
                                <Skeleton
                                    className="w-fit h-fit rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <p className="text-sm text-text2">
                                        Staff cost
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    className="mt-1 rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <p className="text-base font-semibold">
                                            {formatCurrencyVND(
                                                parseInt(String(job?.staffCost))
                                            )}
                                        </p>
                                    ) : (
                                        <NumberInput
                                            endContent={
                                                <p className="text-base font-semibold underline">
                                                    đ
                                                </p>
                                            }
                                            value={parseInt(
                                                String(job?.staffCost)
                                            )}
                                            style={{
                                                fontSize: 'var(--text-base)',
                                                fontWeight: '500',
                                                textWrap: 'wrap',
                                            }}
                                            size="sm"
                                            {...numberInputProps}
                                        />
                                    )}
                                </Skeleton>
                            </div>
                            <div>
                                <Skeleton
                                    className="w-fit h-fit rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <p className="text-sm text-text2">
                                        Payment Channel
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    className="mt-1 rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <p className="text-base font-semibold text-wrap">
                                            {job?.paymentChannel &&
                                                job.paymentChannel.displayName}
                                        </p>
                                    ) : (
                                        <Select
                                            classNames={{
                                                root: 'w-full',
                                            }}
                                            value={job?.paymentChannel.id}
                                            options={paymentChannels?.map(
                                                (pm) => ({
                                                    ...pm,
                                                    label: pm.displayName,
                                                    value: pm.id,
                                                })
                                            )}
                                        />
                                    )}
                                </Skeleton>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5 text-text3" />
                    <div className="space-y-3.5">
                        <Skeleton
                            className="w-fit h-fit rounded-md"
                            isLoaded={!isLoading}
                        >
                            <p className="text-lg font-medium">Job details</p>
                        </Skeleton>
                        <div>
                            <Skeleton
                                className="w-fit h-fit rounded-md"
                                isLoaded={!isLoading}
                            >
                                <p className="text-sm text-text2">Client</p>
                            </Skeleton>
                            <Skeleton
                                className="mt-1 rounded-md"
                                isLoaded={!isLoading}
                            >
                                {!isEditMode ? (
                                    <p className="text-base font-semibold">
                                        {job?.clientName}
                                    </p>
                                ) : (
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
                                )}
                            </Skeleton>
                        </div>
                        <div>
                            <Skeleton
                                className="w-fit h-fit rounded-md"
                                isLoaded={!isLoading}
                            >
                                <p className="text-sm text-text2">
                                    Description
                                </p>
                            </Skeleton>
                            <Skeleton
                                className="mt-1 rounded-md"
                                isLoaded={!isLoading}
                            >
                                {!isEditMode ? (
                                    <TextClamp>{description}</TextClamp>
                                ) : (
                                    <Textarea
                                        value={description}
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            textWrap: 'wrap',
                                        }}
                                        maxRows={5}
                                        {...textAreaProps}
                                    />
                                )}
                            </Skeleton>
                        </div>
                        <div className="space-y-1">
                            <Skeleton
                                className="w-fit h-fit rounded-md"
                                isLoaded={!isLoading}
                            >
                                <p className="text-sm text-text2">
                                    Attachments (
                                    {job?.attachmentUrls?.length ?? 0})
                                </p>
                            </Skeleton>
                            <Skeleton
                                className="mt-1 rounded-md"
                                isLoaded={!isLoading}
                            >
                                {job?.attachmentUrls?.length ? (
                                    <div className="flex items-center justify-start gap-3 flex-wrap">
                                        {job.attachmentUrls.map((att, idx) => (
                                            <Link
                                                key={idx}
                                                href={att}
                                                className="flex items-center justify-start gap-2 px-3 py-2 mt-2 border rounded-sm w-fit"
                                                title="Sharepoint link"
                                            >
                                                <Link2 size={20} />
                                                <p className="font-semibold">
                                                    Sharepoint link
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyAttachments isEditMode={isEditMode} />
                                )}
                            </Skeleton>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <Skeleton
                                    className="w-fit h-fit rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <p className="text-sm text-text2">
                                        Started at
                                    </p>
                                </Skeleton>
                                <Skeleton
                                    className="mt-1 rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <p className="text-base font-semibold text-wrap">
                                            {job?.startedAt &&
                                                VietnamDateFormat(
                                                    job.startedAt
                                                )}
                                        </p>
                                    ) : (
                                        <DatePicker
                                            value={
                                                job?.startedAt
                                                    ? parseDate(
                                                          new Date(
                                                              job?.startedAt
                                                          )
                                                              .toISOString()
                                                              .split('T')[0]
                                                      )
                                                    : null
                                            }
                                            className="max-w-[284px]"
                                        />
                                    )}
                                </Skeleton>
                            </div>
                            <div>
                                <Skeleton
                                    className="w-fit h-fit rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    <p className="text-sm text-text2">Due at</p>
                                </Skeleton>
                                <Skeleton
                                    className="mt-1 rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <p className="text-base font-semibold text-wrap">
                                            {job?.dueAt &&
                                                VietnamDateFormat(job.dueAt)}
                                        </p>
                                    ) : (
                                        <DatePicker
                                            value={
                                                job?.startedAt
                                                    ? parseDate(
                                                          new Date(
                                                              job?.startedAt
                                                          )
                                                              .toISOString()
                                                              .split('T')[0]
                                                      )
                                                    : null
                                            }
                                            className="max-w-[284px]"
                                        />
                                    )}
                                </Skeleton>
                            </div>
                        </div>
                        <div>
                            <Skeleton
                                className="w-fit h-fit rounded-md"
                                isLoaded={!isLoading}
                            >
                                <p className="text-sm text-text2">Assignee</p>
                            </Skeleton>
                            <Skeleton
                                className="mt-1 rounded-md"
                                isLoaded={!isLoading}
                            >
                                {!isEditMode ? (
                                    <div className="px-2.5 mt-3.5 w-full">
                                        {!showFullAssignee ? (
                                            <AvatarGroup
                                                size="sm"
                                                max={5}
                                                total={
                                                    job?.assignee &&
                                                    job?.assignee.length - 5
                                                }
                                                isBordered
                                                classNames={{
                                                    base: 'cursor-pointer',
                                                }}
                                                onClick={() =>
                                                    setShowFullAssignee(true)
                                                }
                                            >
                                                {job?.assignee?.map((mem) => {
                                                    return (
                                                        <Tooltip
                                                            key={mem.id}
                                                            content={
                                                                mem?.displayName
                                                            }
                                                            classNames={{
                                                                content:
                                                                    'max-w-fit text-nowrap',
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={
                                                                    mem?.avatar ??
                                                                    ''
                                                                }
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
                                                    {job?.assignee?.map(
                                                        (mem) => {
                                                            return (
                                                                <div
                                                                    key={mem.id}
                                                                    className="flex items-center justify-start gap-3 p-1 pr-4 bg bg-border rounded-3xl"
                                                                >
                                                                    <Avatar
                                                                        size="sm"
                                                                        src={
                                                                            mem.avatar!
                                                                        }
                                                                        classNames={{
                                                                            img: 'opacity-100',
                                                                        }}
                                                                        isBordered
                                                                        showFallback
                                                                    />
                                                                    <p className="text-sm">
                                                                        {
                                                                            mem.displayName
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )
                                                        }
                                                    )}
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
                                                            setShowFullAssignee(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <ChevronUp />
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </Skeleton>
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
