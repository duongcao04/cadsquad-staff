'use client'

import { dateFormatter } from '@/lib/dayjs'
import {
    useChangeStatusMutation,
    useJobByNo,
    useJobStatusByOrder,
} from '@/lib/queries'
import { INTERNAL_URLS, lightenHexColor } from '@/lib/utils'
import {
    addToast,
    Button,
    Divider,
    Skeleton,
    Spacer,
    Spinner,
} from '@heroui/react'
import dayjs from 'dayjs'
import lodash from 'lodash'
import {
    CalendarDays,
    LibraryBig,
    SquareArrowOutUpRight,
    UserRound,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { TJobStatus } from '../../types'
import { JobStatusChip, PaidChip } from '../chips'
import CountdownTimer from '../ui/countdown-timer'
import { HeroButton } from '../ui/hero-button'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroDrawer,
    HeroDrawerBody,
    HeroDrawerContent,
    HeroDrawerFooter,
    HeroDrawerHeader,
} from '../ui/hero-drawer'
import { HeroTooltip } from '../ui/hero-tooltip'
import { JobDetailView } from './JobDetailView'

type JobDetailDrawerProps = {
    isOpen: boolean
    onClose: () => void
    jobNo: string | null
}
export default function JobDetailDrawer({
    jobNo,
    isOpen,
    onClose,
}: JobDetailDrawerProps) {
    const t = useTranslations()
    const locale = useLocale()

    const { data: job, isLoading: loadingJob } = useJobByNo(jobNo ?? undefined)

    const changeStatusMutation = useChangeStatusMutation()

    const isLoading = lodash.isEmpty(job) || loadingJob

    const isJobCompleted = job?.completedAt !== null

    const onChangeStatus = async (nextStatus: TJobStatus) => {
        if (!isLoading) {
            await changeStatusMutation.mutateAsync({
                jobId: String(job.id),
                data: {
                    fromStatusId: String(job?.status.id),
                    toStatusId: String(nextStatus.id),
                },
            })
        } else {
            addToast({
                title: 'Vui lòng đợi tải dữ liệu',
            })
        }
    }

    return (
        <HeroDrawer isOpen={Boolean(jobNo) && isOpen} onClose={onClose}>
            <HeroDrawerContent className="max-w-full lg:max-w-[50%] xl:max-w-[45%]">
                <HeroDrawerHeader className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {isLoading ? (
                                <Skeleton className="w-20 h-6 rounded-md" />
                            ) : (
                                <>
                                    <span className="text-small font-semibold tracking-wider">
                                        #{job.no}
                                    </span>
                                    <HeroCopyButton textValue={job.no} />
                                </>
                            )}
                            {isLoading ? (
                                <Skeleton className="w-32 h-7 rounded-full" />
                            ) : (
                                <JobStatusChip data={job.status} />
                            )}
                            {isLoading ? (
                                <Skeleton className="w-24 h-7 rounded-full" />
                            ) : (
                                <PaidChip
                                    status={
                                        Boolean(job.isPaid) ? 'paid' : 'unpaid'
                                    }
                                />
                            )}
                        </div>
                        <div className="py-2 pr-2 w-full flex items-center group gap-2">
                            {isLoading ? (
                                <Skeleton className="w-md h-11 rounded-md" />
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-text-default">
                                        {job.displayName}
                                    </h1>
                                    <HeroCopyButton
                                        textValue={job.displayName}
                                        className="hidden group-hover:block"
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex gap-4 text-small text-default-500">
                            <div className="flex items-center gap-1">
                                {isLoading ? (
                                    <Skeleton className="w-24 h-6 rounded-md" />
                                ) : (
                                    <>
                                        <UserRound size={16} />
                                        <span>{job.clientName}</span>
                                    </>
                                )}
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-4 self-center"
                            />
                            <div className="flex items-center gap-1">
                                {isLoading ? (
                                    <Skeleton className="w-24 h-6 rounded-md" />
                                ) : (
                                    <>
                                        <LibraryBig size={16} />
                                        <span>{job.type?.code} - </span>
                                        <span>{job.type?.displayName}</span>
                                    </>
                                )}
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-4 self-center"
                            />

                            {/* DUE ON */}
                            <div className="flex items-center gap-1">
                                {isLoading ? (
                                    <Skeleton className="w-56 h-6 rounded-md" />
                                ) : (
                                    <>
                                        <CalendarDays size={16} />
                                        <div className="flex items-center justify-start gap-2">
                                            <p>
                                                {isJobCompleted
                                                    ? 'Completed at: '
                                                    : 'Due on: '}
                                            </p>
                                            <div className="text-text-default">
                                                {isJobCompleted ? (
                                                    dateFormatter(
                                                        job?.completedAt as
                                                            | string
                                                            | Date,
                                                        { format: 'full' }
                                                    )
                                                ) : (
                                                    <CountdownTimer
                                                        targetDate={dayjs(
                                                            job.dueAt
                                                        )}
                                                        mode="text"
                                                        hiddenUnits={['second']}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mr-8 flex items-center justify-end gap-2">
                        {isLoading ? (
                            <Skeleton className="size-11 rounded-md" />
                        ) : (
                            <HeroTooltip content="Open in new tab">
                                <HeroButton
                                    startContent={
                                        <SquareArrowOutUpRight size={14} />
                                    }
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => {
                                        window.open(
                                            INTERNAL_URLS.getJobDetailUrl(
                                                job.no,
                                                locale
                                            ),
                                            '_blank'
                                        )
                                    }}
                                >
                                    Open in new tab
                                </HeroButton>
                            </HeroTooltip>
                        )}
                        {isLoading ? (
                            <Skeleton className="size-11 rounded-md" />
                        ) : (
                            <HeroTooltip content={t('copyLink')}>
                                <HeroCopyButton
                                    textValue={INTERNAL_URLS.getJobDetailUrl(
                                        job.no
                                    )}
                                    replaceLocale
                                    className="size-8!"
                                />
                            </HeroTooltip>
                        )}
                    </div>
                </HeroDrawerHeader>
                <Divider />
                <HeroDrawerBody>
                    {isLoading ? (
                        <div className="min-h-96 w-full flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <JobDetailView data={job} isLoading={loadingJob} />
                    )}
                </HeroDrawerBody>
                <Spacer className="h-3" />
                <Divider />
                <HeroDrawerFooter
                    style={{
                        display: job?.status?.prevStatusOrder
                            ? 'grid'
                            : 'block',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 12,
                    }}
                >
                    {job?.status?.prevStatusOrder && (
                        <ChangeStatusButton
                            toStatusOrder={job?.status?.prevStatusOrder}
                            onChangeStatus={onChangeStatus}
                        />
                    )}
                    {job?.status?.nextStatusOrder && (
                        <ChangeStatusButton
                            toStatusOrder={job?.status?.nextStatusOrder}
                            onChangeStatus={onChangeStatus}
                        />
                    )}
                    {job && !job?.status?.nextStatusOrder && (
                        <Button
                            color="danger"
                            className="w-full opacity-100! font-medium!"
                            isDisabled
                            style={{
                                color: '#ffffff',
                                backgroundColor: job?.status?.hexColor,
                            }}
                        >
                            {t('finishAtTime', {
                                time: dateFormatter(
                                    job?.finishedAt as string | Date,
                                    { format: 'full' }
                                ),
                            })}
                        </Button>
                    )}
                </HeroDrawerFooter>
            </HeroDrawerContent>
        </HeroDrawer>
    )
}

type ChangeStatusButtonProps = {
    toStatusOrder: number
    onChangeStatus: (nextStatus: TJobStatus) => void
}
function ChangeStatusButton({
    onChangeStatus,
    toStatusOrder,
}: ChangeStatusButtonProps) {
    /**
     * Fetch data
     */
    const { jobStatus } = useJobStatusByOrder(toStatusOrder)

    if (!jobStatus) {
        return <Spinner></Spinner>
    }

    return (
        <Button
            color="danger"
            className="w-full font-semibold font-saira"
            style={{
                color: jobStatus?.hexColor,
                backgroundColor: lightenHexColor(jobStatus?.hexColor, 90),
            }}
            onPress={() => {
                onChangeStatus(jobStatus)
            }}
        >
            Mark as {jobStatus.displayName}
        </Button>
    )
}
