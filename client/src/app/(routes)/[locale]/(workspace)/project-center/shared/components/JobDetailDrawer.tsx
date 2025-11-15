'use client'

import { ApiError } from '@/lib/axios'
import { VietnamDateFormat } from '@/lib/dayjs'
import { lightenHexColor } from '@/lib/utils'
import { useDetailModal } from '@/shared/actions'
import { Countdown, JobStatusChip, PaidChip } from '@/shared/components'
import { Job, JobStatus } from '@/shared/interfaces'
import {
    useChangeStatusMutation,
    useJobByNo,
    useJobStatusByOrder,
} from '@/lib/queries'
import { addToast, Button, Skeleton } from '@heroui/react'
import { Drawer } from 'antd'
import { Clock9 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
    JobDetailActions,
    JobDetailSection,
    JobName,
} from '../../@jobDetail/shared'

type ProjectDetailDrawerProps = {
    isOpen: boolean
    onOpen: () => void
    data: Job
    isLoading?: boolean
}
export default function JobDetailDrawer({
    isOpen,
    onOpen,
    data,
    isLoading = false,
}: ProjectDetailDrawerProps) {
    const t = useTranslations()
    const [isEditJobName, setEditJobName] = useState(false)
    /**
     * Instance hooks
     */
    const { mutateAsync: changeStatusMutation } = useChangeStatusMutation()
    const { closeModal } = useDetailModal()
    /**
     * Fetch data
     */
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
        await changeStatusMutation(
            {
                jobId: String(data?.id),
                data: {
                    fromStatusId: String(data?.status.id),
                    toStatusId: String(nextStatus.id),
                },
            },
            {
                onSuccess: (res) => {
                    addToast({
                        title: res.data.message,
                        color: 'success',
                    })
                },
                onError: (error) => {
                    const err = error as unknown as ApiError
                    addToast({
                        title: err.message,
                        color: 'danger',
                    })
                },
            }
        )
    }

    const handleCloseDrawer = () => {
        closeModal()
        setEditJobName(false)
    }

    return (
        <Drawer
            open={isOpen}
            title={
                <>
                    <div className="grid grid-cols-[1fr_170px] items-start gap-2">
                        <Skeleton
                            className="h-fit w-[200px] rounded-md"
                            isLoaded={!isLoading}
                        >
                            <p className="align-bottom text-lg text-text-muted font-normal underline-offset-2 tracking-wider line-clamp-1">
                                #{data?.no}
                            </p>
                        </Skeleton>
                        <JobDetailActions
                            closeModal={closeModal}
                            data={job}
                            isEditJobName={isEditJobName}
                            setEditJobName={setEditJobName}
                        />
                    </div>
                    <JobName
                        data={job}
                        isEditMode={isEditJobName}
                        setEditMode={setEditJobName}
                    />
                    <div className="mt-5 w-full flex items-center justify-between gap-3">
                        <div className="flex items-center justify-start gap-4">
                            <Skeleton
                                className="w-fit h-[24px] rounded-md"
                                isLoaded={!isLoading}
                            >
                                <div className="size-full">
                                    {data?.status && (
                                        <JobStatusChip data={job.status} />
                                    )}
                                </div>
                            </Skeleton>
                            <Skeleton
                                className="w-fit h-[24px] rounded-md"
                                isLoaded={!isLoading}
                            >
                                <div className="size-full">
                                    <PaidChip
                                        status={
                                            data?.isPaid ? 'paid' : 'unpaid'
                                        }
                                    />
                                </div>
                            </Skeleton>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <div className="text-sm font-medium">
                                <Countdown
                                    targetDate={new Date(data?.dueAt ?? '')}
                                />
                            </div>
                            <Clock9 size={16} />
                        </div>
                    </div>
                </>
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
                    {job && !data?.status.nextStatusOrder && (
                        <Button
                            color="danger"
                            className="w-full !opacity-100"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: data?.status.hexColor,
                            }}
                        >
                            {t('finishAtTime', {
                                time: VietnamDateFormat(job.finishedAt ?? '', {
                                    format: 'LT - L',
                                }),
                            })}
                        </Button>
                    )}
                </div>
            }
            width={1100}
            maskClosable
            mask={true}
            closable={false}
            onClose={handleCloseDrawer}
            classNames={{
                header: '!pt-5 !pb-4 !px-6',
                body: '!py-4 !px-3',
            }}
        >
            <JobDetailSection data={job} isLoading={isLoading} />
        </Drawer>
    )
}
