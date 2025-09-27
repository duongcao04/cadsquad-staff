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
import { ChevronUp, Copy, Ellipsis, Link2, X } from 'lucide-react'

import { useChangeStatusMutation } from '@/shared/queries/useJob'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import { useJobStatusByOrder } from '@/shared/queries/useJobStatus'
import { lightenHexColor } from '@/lib/utils'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { VietnamDateFormat } from '@/lib/dayjs'
import { Link } from '@/i18n/navigation'
import useAuth from '@/shared/queries/useAuth'
import { RoleEnum } from '@/shared/enums/role.enum'
import { formatCurrencyVND } from '@/lib/formatCurrency'
import { usePaymentChannels } from '@/shared/queries/usePaymentChannel'
import TextClamp from '@/shared/components/texts/TextClamp'
import { parseDate } from '@internationalized/date'
import { Job } from '@/shared/interfaces/job.interface'
import WorkLogTab from '@/app/(routes)/[locale]/(dashboard)/onboarding/@jobDetail/_components/WorkLogTab'
import { useDetailModal } from '@/shared/actions/useDetailModal'
import PaidChip from '../chips/PaidChip'

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

type Props = {
    isOpen: boolean
    openModal?: () => void
    isEditMode?: boolean
    data: Job
    isLoading?: boolean
}
export default function JobDetailDrawer({
    isLoading = false,
    data,
    isOpen = false,
    openModal,
    isEditMode = false,
}: Props) {
    const { userRole } = useAuth()
    /**
     * Instance hooks
     */
    const [showFullAssignee, setShowFullAssignee] = useState(false)
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { switchMode, closeModal } = useDetailModal()
    /**
     * Fetch data
     */
    const { data: paymentChannels } = usePaymentChannels()
    const { jobStatus: prevStatus } = useJobStatusByOrder(
        data?.status.prevStatusOrder
    )
    const { jobStatus: nextStatus } = useJobStatusByOrder(
        data?.status.nextStatusOrder
    )
    /**
     * Change status action
     */
    const handleChangeStatus = async (nextStatus: JobStatus) => {
        try {
            await changeStatusMutation(
                {
                    jobId: String(data?.id),
                    changeStatusInput: {
                        fromStatusId: String(data?.status.id),
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
                <div className="grid grid-cols-[1fr_170px] items-start gap-2">
                    <div className="w-full space-y-2.5">
                        <div className="w-full flex items-center justify-start gap-2">
                            <Skeleton
                                className="w-full h-full rounded-md"
                                isLoaded={!isLoading}
                            >
                                {!isEditMode ? (
                                    <p>
                                        <span className="inline-block align-bottom text-3xl font-semibold">
                                            {data?.displayName}
                                        </span>
                                        <span className="pl-2.5 inline-block align-bottom text-2xl underline text-text2 font-normal underline-offset-2 tracking-wider line-clamp-1">
                                            #{data?.no}
                                        </span>
                                    </p>
                                ) : (
                                    <Input
                                        value={data?.displayName}
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
                        <div className="flex items-center justify-start gap-4">
                            <Skeleton
                                className="w-fit h-[24px] rounded-md"
                                isLoaded={!isLoading}
                            >
                                <div className="w-full h-full">
                                    {data?.status && (
                                        <JobStatusChip data={data.status} />
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
                                            data?.isPaid ? 'paid' : 'unpaid'
                                        }
                                    />
                                </div>
                            </Skeleton>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-end gap-2">
                        {userRole === RoleEnum.ADMIN && (
                            <Button
                                size="sm"
                                onPress={() => {
                                    if (isEditMode) {
                                        switchMode('view')
                                    } else {
                                        switchMode('edit')
                                    }
                                }}
                                variant="solid"
                            >
                                <p className="text-sm font-medium">Edit</p>
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
                                                process.env.NEXT_PUBLIC_URL
                                            ) +
                                                '/' +
                                                'onboarding?detail=' +
                                                data?.no
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
                                <Copy size={18} className="text-text-fore2" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Actions">
                            <Button
                                variant="light"
                                color="primary"
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                            >
                                <Ellipsis
                                    size={18}
                                    className="text-text-fore2"
                                />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Close panel" color="danger">
                            <Button
                                variant="light"
                                color="danger"
                                className="flex items-center justify-center"
                                size="sm"
                                isIconOnly
                                onPress={() => {
                                    closeModal?.()
                                }}
                            >
                                <X size={18} className="text-text-fore2" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            }
            footer={
                <div
                    style={{
                        display: data?.status.prevStatusOrder
                            ? 'grid'
                            : 'block',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    {data?.status.prevStatusOrder && prevStatus && (
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
                    {data?.status.nextStatusOrder && nextStatus && (
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
                    {data && !data?.status.nextStatusOrder && (
                        <Button
                            color="danger"
                            className="w-full !opacity-100"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: data?.status.hexColor,
                            }}
                        >
                            Finish at 2025/09/01 - 19:06
                        </Button>
                    )}
                </div>
            }
            width={1100}
            maskClosable
            mask={true}
            closable={false}
            onClose={closeModal}
            classNames={{
                header: '!pt-9 !pb-4 !px-6',
                body: '!py-4 !px-6',
            }}
        >
            <>
                <div className="border-1 border-text2 grid grid-cols-3 gap-5 px-5 py-3 rounded-lg divide-x-1 divide-text3">
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
                                        parseInt(String(data?.incomeCost)),
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
                                    value={parseInt(String(data?.incomeCost))}
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
                            <p className="text-sm text-text2">Staff cost</p>
                        </Skeleton>
                        <Skeleton
                            className="mt-1 rounded-md"
                            isLoaded={!isLoading}
                        >
                            {!isEditMode ? (
                                <p className="text-base font-semibold">
                                    {formatCurrencyVND(
                                        parseInt(String(data?.staffCost))
                                    )}
                                </p>
                            ) : (
                                <NumberInput
                                    startContent={
                                        <p className="text-base font-semibold underline">
                                            đ
                                        </p>
                                    }
                                    value={parseInt(String(data?.staffCost))}
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
                                    {data?.paymentChannel &&
                                        data.paymentChannel.displayName}
                                </p>
                            ) : (
                                <Select
                                    classNames={{
                                        root: 'w-full',
                                    }}
                                    value={data?.paymentChannel.id}
                                    options={paymentChannels?.map((pm) => ({
                                        ...pm,
                                        label: pm.displayName,
                                        value: pm.id,
                                    }))}
                                />
                            )}
                        </Skeleton>
                    </div>
                </div>
                <hr className="mt-5 text-text3" />
                <div className="mt-3">
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <p className="text-lg font-medium">Job details</p>
                    </Skeleton>
                    <div className="px-3 mt-3 space-y-3.5">
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
                                        {data?.clientName}
                                    </p>
                                ) : (
                                    <Input
                                        value={data?.clientName}
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
                                    {data?.attachmentUrls?.length ?? 0})
                                </p>
                            </Skeleton>
                            <Skeleton
                                className="mt-1 rounded-md"
                                isLoaded={!isLoading}
                            >
                                {data?.attachmentUrls?.length ? (
                                    <div className="flex items-center justify-start gap-3 flex-wrap">
                                        {data.attachmentUrls.map((att, idx) => (
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
                                            {data?.startedAt &&
                                                VietnamDateFormat(
                                                    data.startedAt
                                                )}
                                        </p>
                                    ) : (
                                        <DatePicker
                                            value={
                                                data?.startedAt
                                                    ? parseDate(
                                                          new Date(
                                                              data?.startedAt
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
                                            {data?.dueAt &&
                                                VietnamDateFormat(data.dueAt)}
                                        </p>
                                    ) : (
                                        <DatePicker
                                            value={
                                                data?.startedAt
                                                    ? parseDate(
                                                          new Date(
                                                              data?.startedAt
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
                                                    data?.assignee &&
                                                    data?.assignee.length - 5
                                                }
                                                isBordered
                                                classNames={{
                                                    base: 'cursor-pointer',
                                                }}
                                                onClick={() =>
                                                    setShowFullAssignee(true)
                                                }
                                            >
                                                {data?.assignee?.map((mem) => {
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
                                                    {data?.assignee?.map(
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
                </div>
                <hr className="mt-7 text-text3" />
                <div className="mt-3">
                    <Skeleton
                        className="w-fit h-fit rounded-md"
                        isLoaded={!isLoading}
                    >
                        <p className="text-lg font-medium">Activity</p>
                    </Skeleton>
                    <div className="px-3 mt-3 space-y-3">
                        <Tabs aria-label="Job action tabs">
                            <Tab key="1" title="Work log">
                                <WorkLogTab jobId={data?.id?.toString()} />
                            </Tab>
                            <Tab key="2" title="Comments" isDisabled></Tab>
                        </Tabs>
                    </div>
                </div>
            </>
        </Drawer>
    )
}
