'use client'

import { Link } from '@/i18n/navigation'
import { dateFormatter } from '@/lib/dayjs'
import { useJobsByDeadline } from '@/lib/queries'
import { Skeleton } from '@heroui/react'
import { Modal } from 'antd'
import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import {
    JobCard,
    JobCardSkeleton,
} from '../../../app/(routes)/[locale]/(workspace)/profile/shared'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type Props = {
    isOpen: boolean
    onClose: () => void
    currentDate: Date
}

function JobDueModal({ isOpen, onClose, currentDate }: Props) {
    const t = useTranslations()

    const { data: jobs, isLoading } = useJobsByDeadline(
        currentDate.toISOString()
    )

    return (
        <Modal
            open={isOpen && Boolean(currentDate)}
            onCancel={onClose}
            title={
                <div className="space-y-1">
                    <p className="text-lg font-semibold">
                        {t('upcomingTask')}{' '}
                        <Skeleton
                            className="inline-block w-8 h-3 rounded-md"
                            isLoaded={!isLoading}
                        >
                            <span className="text-base text-text-subdued">
                                ({jobs?.length ?? 0})
                            </span>
                        </Skeleton>
                    </p>
                    <p className="text-sm flex items-center justify-start gap-2">
                        <CalendarDays size={16} className="text-text-subdued" />
                        <span>
                            {dateFormatter(currentDate, {
                                format: 'longDate',
                            })}
                        </span>
                    </p>
                </div>
            }
            width={{
                xs: '90%',
                sm: '80%',
                md: '80%',
                lg: '80%',
                xl: '70%',
                xxl: '50%',
            }}
            style={{ top: 100 }}
            footer={<></>}
        >
            <ScrollArea className="size-full">
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
                <div className="min-w-full w-fit py-5 space-y-5 border-t border-border max-h-[500px]">
                    {/* Loading */}
                    {isLoading &&
                        new Array(4).fill(0).map((_, idx) => {
                            return <JobCardSkeleton key={idx} />
                        })}

                    {/* Empty list */}
                    {!isLoading && jobs?.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-subdued">
                            <p className="text-base font-semibold">
                                {t('emptyDueOnToday')}
                            </p>
                            <p className="tracking-wide text-sm">
                                {t('viewAllJobs')}{' '}
                                <Link
                                    href={'/project-center?tab=active'}
                                    className="link !underline"
                                >
                                    {t('here')}
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* List */}
                    {!isLoading &&
                        jobs?.map((job) => {
                            return (
                                <JobCard
                                    key={job.id}
                                    data={job}
                                    onPress={onClose}
                                />
                            )
                        })}
                </div>
            </ScrollArea>
        </Modal>
    )
}
export default React.memo(JobDueModal)
