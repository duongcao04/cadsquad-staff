import { jobsListOptions } from '@/lib/queries'
import { getPageTitle, INTERNAL_URLS, JOB_STATUS_CODES } from '@/lib/utils'
import {
    HeroCard,
    HeroCardBody,
    HeroCardHeader,
    PageHeading,
    ScrollArea,
    ScrollBar,
} from '@/shared/components'
import JobCard from '@/shared/components/profile/JobCard'
import { ProfileCard } from '@/shared/components/profile/ProfileCard'
import { Tab, Tabs } from '@heroui/react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_workspace/profile')({
    head: () => ({
        meta: [
            {
                title: getPageTitle('Profile'),
            },
        ],
    }),
    component: ProfilePage,
})

export default function ProfilePage() {
    const [
        {
            data: { jobs: activeJobs },
        },
        {
            data: { jobs: deliveredJobs },
        },
    ] = useSuspenseQueries({
        queries: [
            {
                ...jobsListOptions({
                    status: [
                        JOB_STATUS_CODES.inProgress,
                        JOB_STATUS_CODES.revision,
                    ],
                    isAll: '1',
                }),
            },
            {
                ...jobsListOptions({
                    status: [JOB_STATUS_CODES.delivered],
                    isAll: '1',
                }),
            },
        ],
    })

    return (
        <>
            <div className="border-b border-border-default">
                <PageHeading
                    title="Profile"
                    classNames={{
                        wrapper: '!py-3 pl-6 pr-3.5',
                    }}
                />
            </div>

            <div className="pl-5 pr-3.5 pt-5">
                <div className="size-full grid grid-cols-4 gap-3">
                    {/* PROFILE CARD */}
                    <div className="col-span-1">
                        <ProfileCard />
                    </div>

                    {/* JOB OVERVIEW */}
                    <div className="col-span-3">
                        <Tabs aria-label="Profile tracking jobs">
                            <Tab key="active" title="Active jobs">
                                <HeroCard className="border-none">
                                    <HeroCardHeader className="px-3 text-text-default">
                                        <div>
                                            <p className="text-base font-semibold">
                                                Active jobs -{' '}
                                                <span className="text-base font-medium text-text-subdued">
                                                    ({activeJobs?.length})
                                                </span>
                                            </p>
                                        </div>
                                    </HeroCardHeader>
                                    <HeroCardBody>
                                        <ScrollArea className="size-full max-h-[calc(100vh-300px)] bg-background-muted">
                                            <ScrollBar orientation="horizontal" />
                                            <ScrollBar orientation="vertical" />
                                            {activeJobs?.length ? (
                                                <ul className="space-y-4 pb-10">
                                                    {activeJobs.map((aJob) => {
                                                        return (
                                                            <JobCard
                                                                key={aJob.id}
                                                                data={aJob}
                                                                // isLoading={
                                                                //     inprogressLoading ||
                                                                //     revisionLoading
                                                                // }
                                                            />
                                                        )
                                                    })}
                                                </ul>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
                                                    <p className="text-base font-semibold">
                                                        No active job found.
                                                    </p>
                                                    <p className="tracking-wide text-sm">
                                                        View all job
                                                        <Link
                                                            to={
                                                                INTERNAL_URLS.projectCenter
                                                            }
                                                            className="link underline!"
                                                        >
                                                            here
                                                        </Link>
                                                    </p>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </HeroCardBody>
                                </HeroCard>
                            </Tab>
                            <Tab
                                key="waitingResponse"
                                title="Awaiting response"
                            >
                                <ScrollArea className="size-full max-h-[calc(100vh-300px)] bg-background-muted">
                                    <ScrollBar orientation="horizontal" />
                                    <ScrollBar orientation="vertical" />

                                    <HeroCard className="border-none">
                                        <HeroCardHeader className="px-3 text-text-default">
                                            <div>
                                                <p className="text-base font-semibold">
                                                    Awaiting response
                                                    <span className="text-base font-medium text-text-subdued">
                                                        ({deliveredJobs?.length}
                                                        )
                                                    </span>
                                                </p>
                                            </div>
                                        </HeroCardHeader>
                                        <HeroCardBody>
                                            {deliveredJobs?.length ? (
                                                <ul className="space-y-4 pb-10">
                                                    {deliveredJobs?.map(
                                                        (aJob) => {
                                                            return (
                                                                <JobCard
                                                                    key={
                                                                        aJob.id
                                                                    }
                                                                    data={aJob}
                                                                    // isLoading={deliveredLoading}
                                                                />
                                                            )
                                                        }
                                                    )}
                                                </ul>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
                                                    <p className="text-base font-semibold">
                                                        No awaiting response
                                                        found.
                                                    </p>
                                                    <p className="tracking-wide text-sm">
                                                        View all jobs
                                                        <Link
                                                            to={
                                                                INTERNAL_URLS.projectCenter
                                                            }
                                                            className="link underline!"
                                                        >
                                                            here
                                                        </Link>
                                                    </p>
                                                </div>
                                            )}
                                        </HeroCardBody>
                                    </HeroCard>
                                </ScrollArea>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}
