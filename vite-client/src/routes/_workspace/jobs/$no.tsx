import { dateFormatter } from '@/lib'
import { useJobByNo } from '@/lib/queries/useJob'
import { INTERNAL_URLS } from '@/lib/utils'
import { JobStatusChip, PageHeading, PaidChip } from '@/shared/components'
import { JobDetailView } from '@/shared/components/job-detail/JobDetailView'
import CountdownTimer from '@/shared/components/ui/countdown-timer'
import {
    HeroBreadcrumbItem,
    HeroBreadcrumbs,
} from '@/shared/components/ui/hero-breadcrumbs'
import {
    HeroCard,
    HeroCardBody,
    HeroCardHeader,
} from '@/shared/components/ui/hero-card'
import HeroCopyButton from '@/shared/components/ui/hero-copy-button'
import { Divider, Skeleton, Spacer, Spinner } from '@heroui/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { CalendarDays, House, LibraryBig, UserRound } from 'lucide-react'
import { JobActionToolbar } from '../../../shared/components/job-detail/JobActionToolbar'

export const Route = createFileRoute('/_workspace/jobs/$no')({
    component: JobDetailPage,
})

function JobDetailPage() {
    const { no } = Route.useParams()

    const { data: job, isLoading: loadingJob } = useJobByNo(no)

    const isLoading = lodash.isEmpty(job) || loadingJob

    const isJobCompleted = job?.completedAt !== null

    return (
        <div className="bg-background h-full flex flex-col">
            {/* HEADING */}
            <div className="border-b border-border-default">
                <PageHeading
                    title="Project Center"
                    classNames={{
                        wrapper: 'py-3! pl-6 pr-3.5',
                    }}
                />
            </div>

            <div className="w-7xl mx-auto">
                <HeroBreadcrumbs className="pt-4! pb-3! px-2">
                    <HeroBreadcrumbItem>
                        <Link
                            to={INTERNAL_URLS.home}
                            className="text-text-subdued!"
                        >
                            <House size={16} />
                        </Link>
                    </HeroBreadcrumbItem>
                    <HeroBreadcrumbItem>
                        <Link
                            to={INTERNAL_URLS.projectCenter}
                            className="text-text-subdued!"
                        >
                            Jobs
                        </Link>
                    </HeroBreadcrumbItem>
                    <HeroBreadcrumbItem>
                        {isLoading ? (
                            <Skeleton className="w-20 h-6 rounded-md" />
                        ) : (
                            <p className="font-medium text-text-7">#{job.no}</p>
                        )}
                    </HeroBreadcrumbItem>
                </HeroBreadcrumbs>

                <Spacer className="h-1" />

                <JobActionToolbar />

                <Divider className="my-5 bg-text-disabled" />

                <div>
                    {/* MAIN CONTENT */}
                    <HeroCard>
                        <HeroCardHeader>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        {isLoading ? (
                                            <Skeleton className="w-20 h-6 rounded-md" />
                                        ) : (
                                            <>
                                                <span className="text-small font-semibold tracking-wider">
                                                    #{job.no}
                                                </span>
                                                <HeroCopyButton
                                                    textValue={job.no}
                                                />
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
                                                    Boolean(job.isPaid)
                                                        ? 'paid'
                                                        : 'unpaid'
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
                                                <span>
                                                    {job.type?.displayName}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <Divider
                                        orientation="vertical"
                                        className="h-4 self-center"
                                    />
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
                                                                {
                                                                    format: 'full',
                                                                }
                                                            )
                                                        ) : (
                                                            <CountdownTimer
                                                                targetDate={dayjs(
                                                                    job.dueAt
                                                                )}
                                                                mode="text"
                                                                hiddenUnits={[
                                                                    'second',
                                                                ]}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </HeroCardHeader>
                        <Divider />
                        <HeroCardBody>
                            {isLoading ? (
                                <div className="min-h-96 w-full flex items-center justify-center">
                                    <Spinner size="lg" />
                                </div>
                            ) : (
                                <JobDetailView
                                    data={job}
                                    isLoading={loadingJob}
                                />
                            )}
                        </HeroCardBody>
                        <Spacer className="h-3" />
                    </HeroCard>
                </div>
            </div>
        </div>
    )
}
