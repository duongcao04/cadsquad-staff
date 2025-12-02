'use client'

import { Link } from '@/i18n/navigation'
import { dateFormatter } from '@/lib/dayjs'
import { useJobsByDeadline } from '@/lib/queries'
import { Skeleton } from '@heroui/react'
import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import JobCard, { JobCardSkeleton } from '../profile/JobCard'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'

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
        <HeroModal
            isOpen={isOpen && Boolean(currentDate)}
            onClose={onClose}
            classNames={{
                base: 'max-w-[90%] sm:max-w-[80%] md:max-w-[80%] xl:max-w-[60%]',
            }}
            style={{
                bottom: '200px',
            }}
        >
            <HeroModalContent>
                <HeroModalHeader>
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
                            <CalendarDays
                                size={16}
                                className="text-text-subdued"
                            />
                            <span>
                                {dateFormatter(currentDate, {
                                    format: 'longDate',
                                })}
                            </span>
                        </p>
                    </div>
                </HeroModalHeader>
                <HeroModalBody>
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
                                            className="link underline!"
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
                </HeroModalBody>
            </HeroModalContent>
        </HeroModal>
    )
}
export default React.memo(JobDueModal)
