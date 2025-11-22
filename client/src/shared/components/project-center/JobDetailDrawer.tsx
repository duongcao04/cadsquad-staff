'use client'

import { VietnamDateFormat } from '@/lib/dayjs'
import {
    useChangeStatusMutation,
    useJobByNo,
    useJobStatusByOrder,
} from '@/lib/queries'
import { lightenHexColor } from '@/lib/utils'
import { useDetailModal } from '@/shared/actions'
import { Countdown, JobStatusChip, PaidChip } from '@/shared/components'
import { Button, Skeleton } from '@heroui/react'
import { Drawer } from 'antd'
import { Clock9 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
    JobDetailActions,
    JobDetailSection,
} from '../../../app/(routes)/[locale]/(workspace)/project-center/@jobDetail/shared'
import { TJobStatus } from '../../types'

type JobDetailDrawerProps = {
    isOpen: boolean
    onClose: () => void
    jobNo: string
}
export default function JobDetailDrawer({
    isOpen,
    onClose,
    jobNo,
}: JobDetailDrawerProps) {
    const t = useTranslations()

    const { job, isLoading } = useJobByNo(jobNo)

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
        job?.status?.prevStatusOrder
    )
    const { jobStatus: nextStatus } = useJobStatusByOrder(
        job?.status?.nextStatusOrder
    )

    /**
     * Change status action
     */
    const onChangeStatus = async (nextStatus: TJobStatus) => {
        await changeStatusMutation({
            jobId: String(job.id),
            data: {
                fromStatusId: String(job?.status.id),
                toStatusId: String(nextStatus.id),
            },
        })
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
                                #{job.no}
                            </p>
                        </Skeleton>
                        <JobDetailActions
                            closeModal={closeModal}
                            data={job}
                            isEditJobName={isEditJobName}
                            setEditJobName={setEditJobName}
                        />
                    </div>

                    <div className="mt-5 w-full flex items-center justify-between gap-3">
                        <div className="flex items-center justify-start gap-4">
                            <Skeleton
                                className="w-fit h-[24px] rounded-md"
                                isLoaded={!isLoading}
                            >
                                <div className="size-full">
                                    {job?.status && (
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
                                        status={job?.isPaid ? 'paid' : 'unpaid'}
                                    />
                                </div>
                            </Skeleton>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <div className="text-sm font-medium">
                                <Countdown targetDate={job.dueAt} />
                            </div>
                            <Clock9 size={16} />
                        </div>
                    </div>
                </>
            }
            footer={
                <div
                    style={{
                        display: job?.status?.prevStatusOrder
                            ? 'grid'
                            : 'block',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    {job?.status?.prevStatusOrder && prevStatus && (
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
                            onPress={() => onChangeStatus(prevStatus)}
                        >
                            Mark as {prevStatus.displayName}
                        </Button>
                    )}
                    {job?.status?.nextStatusOrder && nextStatus && (
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
                                onChangeStatus(nextStatus)
                            }}
                        >
                            Mark as {nextStatus.displayName}
                        </Button>
                    )}
                    {job && !job?.status?.nextStatusOrder && (
                        <Button
                            color="danger"
                            className="w-full !opacity-100"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: job?.status?.hexColor,
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
