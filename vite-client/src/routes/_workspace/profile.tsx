import { useJobsByStatusCode } from '@/lib/queries'
import { getPageTitle, INTERNAL_URLS, JOB_STATUS_CODES } from '@/lib/utils'
import { PageHeading } from '@/shared/components'
import JobCard from '@/shared/components/profile/JobCard'
import { ProfileCard } from '@/shared/components/profile/ProfileCard'
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
    const { jobs: inprogressJobs } = useJobsByStatusCode(
        JOB_STATUS_CODES.inProgress
    )
    const { jobs: revisionJobs } = useJobsByStatusCode(
        JOB_STATUS_CODES.revision
    )
    const { jobs: deliveredJobs } = useJobsByStatusCode(
        JOB_STATUS_CODES.delivered
    )
    const activeJobs = [...(inprogressJobs ?? []), ...(revisionJobs ?? [])]

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
                    <div
                        className="col-span-3 w-full h-full overflow-y-auto rounded-lg bg-background"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.014) 0px 6px 24px 0px, rgba(0, 0, 0, 0.014) 0px 0px 0px 1px',
                        }}
                    >
                        <div className="relative">
                            <div className="sticky top-0 z-10 bg-background my-5 px-6 pb-4 pt-3 border-b border-text-muted shadow-xs">
                                <div className="px-4 py-2.5 border rounded-lg border-text-muted shadow-xs">
                                    <p className="text-lg font-medium">
                                        Active jobs -{' '}
                                        <span className="text-text-muted font-semibold tracking-wider">
                                            {activeJobs?.length}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {activeJobs?.length ? (
                                <ul className="space-y-4 px-6 pb-10">
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
                                            to={INTERNAL_URLS.projectCenter}
                                            className="link underline!"
                                        >
                                            here
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="sticky top-0 pt-8 pb-4 z-10 px-5 bg-background">
                            <div className="flex items-center justify-start gap-4 pl-2">
                                <p className="font-medium text-text-default text-nowrap">
                                    Awaiting response
                                    <span className="pl-2 font-semibold text-text-muted">
                                        ({deliveredJobs?.length})
                                    </span>
                                </p>
                                <div className="bg-text-muted h-px w-full" />
                            </div>
                        </div>
                        {deliveredJobs?.length ? (
                            <ul className="mt-5 space-y-4 px-6 pb-10">
                                {deliveredJobs?.map((aJob) => {
                                    return (
                                        <JobCard
                                            key={aJob.id}
                                            data={aJob}
                                            // isLoading={deliveredLoading}
                                        />
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
                                <p className="text-base font-semibold">
                                    No awaiting response found.
                                </p>
                                <p className="tracking-wide text-sm">
                                    View all jobs
                                    <Link
                                        to={INTERNAL_URLS.projectCenter}
                                        className="link underline!"
                                    >
                                        here
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
