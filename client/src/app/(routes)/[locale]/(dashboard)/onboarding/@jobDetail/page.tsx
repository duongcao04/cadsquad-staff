'use client'

import React from 'react'
import { useDetailModal } from '@/shared/actions/useDetailModal'
import JobDetailSection from '../../_components/JobDetailSection'
import { useJobStatusByOrder } from '@/shared/queries/useJobStatus'
import { useChangeStatusMutation, useJobByNo } from '@/shared/queries/useJob'
import {
    addToast,
    Button,
    Input,
    InputProps,
    Skeleton,
    Tooltip,
} from '@heroui/react'
import { Drawer } from 'antd'
import { Clock9, X } from 'lucide-react'
import PaidChip from '@/shared/components/chips/PaidChip'
import JobStatusChip from '@/shared/components/chips/JobStatusChip'
import { JobStatus } from '@/shared/interfaces/jobStatus.interface'
import { lightenHexColor } from '@/lib/utils'
import ActionsDropdown from './_components/dropdowns/ActionsDropdown'
import { Job } from '@/shared/interfaces/job.interface'
import CountDown from '@/shared/components/texts/CountDown'
import { CopyButton } from '@/shared/components/ui/copy-button'
import envConfig from '@/config/envConfig'
import { useLocale } from 'next-intl'

export default function JobDetailView() {
    const locale = useLocale()
    const { jobNo, isOpen, isEditMode } = useDetailModal()
    const { job, isLoading } = useJobByNo(jobNo)
    /**
     * Instance hooks
     */
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { closeModal } = useDetailModal()
    /**
     * Fetch data
     */
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

    return (
        <Drawer
            open={isOpen}
            title={
                <div className="space-y-1">
                    <div className="grid grid-cols-[1fr_170px] items-start gap-2">
                        <div className="w-full space-y-2.5">
                            <div className="w-full flex items-center justify-start gap-2">
                                <Skeleton
                                    className="w-full h-full rounded-md"
                                    isLoaded={!isLoading}
                                >
                                    {!isEditMode ? (
                                        <div>
                                            <p className="align-bottom text-lg text-text2 font-normal underline-offset-2 tracking-wider line-clamp-1">
                                                #{job?.no}
                                            </p>
                                            <p className="align-bottom text-3xl font-semibold">
                                                {job?.displayName}
                                            </p>
                                        </div>
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
                        </div>
                        <div className="w-full flex items-center justify-end gap-2">
                            {/* {userRole === RoleEnum.ADMIN && (
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
                            )} */}
                            <Tooltip content="Copy link">
                                <Button
                                    variant="light"
                                    color="primary"
                                    className="flex items-center justify-center"
                                    size="sm"
                                    isIconOnly
                                >
                                    <CopyButton
                                        slot="p"
                                        content={
                                            envConfig.NEXT_PUBLIC_URL +
                                            `/${locale}/` +
                                            `onboarding?detail=${job?.no}`
                                        }
                                        variant="ghost"
                                        suppressHydrationWarning
                                    />
                                </Button>
                            </Tooltip>
                            <Tooltip content="Actions">
                                <ActionsDropdown
                                    data={job as Job}
                                    jobNo={jobNo as string}
                                />
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
                    <div className="w-full flex items-center justify-between gap-3">
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
                                        status={job?.isPaid ? 'paid' : 'unpaid'}
                                    />
                                </div>
                            </Skeleton>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <div className="text-sm font-medium">
                                <CountDown
                                    endedDate={new Date(job?.dueAt ?? '')}
                                />
                            </div>
                            <Clock9 size={16} />
                        </div>
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
            width={1100}
            maskClosable
            mask={true}
            closable={false}
            onClose={closeModal}
            classNames={{
                header: '!pt-9 !pb-4 !px-6',
                body: '!py-4 !px-3',
            }}
        >
            <JobDetailSection jobNo={jobNo} isEditMode={isEditMode} />
        </Drawer>
    )
}
