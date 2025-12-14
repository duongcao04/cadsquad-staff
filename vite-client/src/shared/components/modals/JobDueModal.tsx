import { Skeleton } from '@heroui/react'
import { CalendarDays } from 'lucide-react'

import { dateFormatter } from '@/lib/dayjs'
import { useJobsByDeadline } from '@/lib/queries'

import React from 'react'
import JobCard, { JobCardSkeleton } from '../profile/JobCard'
import {
    HeroModal,
    HeroModalBody,
    HeroModalContent,
    HeroModalHeader,
} from '../ui/hero-modal'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

type Props = {
    isOpen: boolean
    onClose: () => void
    currentDate: Date
}

function JobDueModal({ isOpen, onClose, currentDate }: Props) {
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
                            Upcoming tasks
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
                        <div className="min-w-full w-fit py-5 space-y-5 border-t border-border max-h-125">
                            {/* Loading */}
                            {isLoading &&
                                new Array(4).fill(0).map((_, idx) => {
                                    return <JobCardSkeleton key={idx} />
                                })}

                            {/* Empty list */}
                            {!isLoading && jobs?.length === 0 && (
                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-subdued">
                                    <p className="text-base font-semibold">
                                        Empty tasks for today.
                                    </p>
                                    <p className="tracking-wide text-sm">
                                        View all jobs
                                        <a
                                            href={'/project-center/active'}
                                            className="pl-2 link underline!"
                                        >
                                            here
                                        </a>
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
