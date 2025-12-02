import { Button, Divider, Spacer } from '@heroui/react'
import dayjs from 'dayjs'
import { CalendarDays, LibraryBig, UserRound } from 'lucide-react'
import {
    useChangeStatusMutation,
    useJobByNo,
    useJobStatusByOrder,
} from '../../../lib/queries'
import { PaidChip } from '../chips'
import CountdownTimer from '../ui/countdown-timer'
import HeroCopyButton from '../ui/hero-copy-button'
import {
    HeroDrawer,
    HeroDrawerBody,
    HeroDrawerContent,
    HeroDrawerFooter,
    HeroDrawerHeader,
} from '../ui/hero-drawer'
import { JobDetailView } from './JobDetailView'
import { lightenHexColor } from '../../../lib/utils'
import { TJobStatus } from '../../types'
import { VietnamDateFormat } from '../../../lib/dayjs'
import { useTranslations } from 'next-intl'

type JobDetailDrawerProps = {
    isOpen: boolean
    onClose: () => void
    jobNo?: string
}
export default function JobDetailDrawer({
    jobNo,
    isOpen,
    onClose,
}: JobDetailDrawerProps) {
    const t = useTranslations()
    const { data: job, isLoading: loadingJob } = useJobByNo(jobNo)
    const changeStatusMutation = useChangeStatusMutation()

    const onChangeStatus = async (nextStatus: TJobStatus) => {
        await changeStatusMutation.mutateAsync({
            jobId: String(job.id),
            data: {
                fromStatusId: String(job?.status.id),
                toStatusId: String(nextStatus.id),
            },
        })
    }

    return (
        <HeroDrawer isOpen={Boolean(jobNo) && isOpen} onClose={onClose}>
            <HeroDrawerContent className="max-w-full lg:max-w-[50%] xl:max-w-[45%]">
                <HeroDrawerHeader>
                    <div className="flex flex-col gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-small font-semibold tracking-wider">
                                    #{job.no}
                                </span>
                                <HeroCopyButton textValue={job.no} />
                                <PaidChip
                                    status={
                                        Boolean(job.isPaid) ? 'paid' : 'unpaid'
                                    }
                                />
                            </div>
                            <div className="py-2 pr-2 w-full flex items-center group gap-2">
                                <h1 className="text-2xl font-bold text-text-default">
                                    {job.displayName}
                                </h1>
                                <HeroCopyButton
                                    textValue={job.displayName}
                                    className="hidden group-hover:block"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 text-small text-default-500">
                            <div className="flex items-center gap-1">
                                <UserRound size={16} />
                                <span>{job.clientName}</span>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-4 self-center"
                            />
                            <div className="flex items-center gap-1">
                                <LibraryBig size={16} />
                                <span>{job.type?.code} - </span>
                                <span>{job.type?.displayName}</span>
                            </div>
                            <Divider
                                orientation="vertical"
                                className="h-4 self-center"
                            />
                            <div className="flex items-center gap-1">
                                <CalendarDays size={16} />
                                <div className="flex items-center justify-start gap-2">
                                    <p>Due on:</p>
                                    <CountdownTimer
                                        targetDate={dayjs(job.dueAt)}
                                        mode="text"
                                        hiddenUnits={['second']}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </HeroDrawerHeader>
                <Divider />
                <HeroDrawerBody>
                    <JobDetailView data={job} isLoading={loadingJob} />
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
                            className="w-full opacity-100!"
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
