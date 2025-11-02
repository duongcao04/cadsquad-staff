'use client'

import { Link } from '@/i18n/navigation'
import { useJobsByStatusCode } from '@/lib/queries'
import { JOB_STATUS_CODES } from '@/lib/utils'
import { PageHeading } from '@/shared/components'
import { useTranslations } from 'next-intl'
import { JobCard, ProfileCard } from './shared'

export default function ProfilePage() {
    const t = useTranslations()
    const { jobs: inprogressJobs, isLoading: inprogressLoading } =
        useJobsByStatusCode(JOB_STATUS_CODES.inProgress)
    const { jobs: revisionJobs, isLoading: revisionLoading } =
        useJobsByStatusCode(JOB_STATUS_CODES.revision)
    const { jobs: deliveredJobs, isLoading: deliveredLoading } =
        useJobsByStatusCode(JOB_STATUS_CODES.delivered)
    const activeJobs = [...(inprogressJobs ?? []), ...(revisionJobs ?? [])]

    return (
        <>
            <PageHeading title={t('profile')} />
            <div className="w-full pb-3 h-[calc(100%-54px)]">
                <div className="size-full grid grid-cols-4 gap-3">
                    {/* Left Panel - User Profile */}
                    <div
                        className="col-span-1 size-full rounded-lg bg-background px-4 py-2"
                        style={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.014) 0px 6px 24px 0px, rgba(0, 0, 0, 0.014) 0px 0px 0px 1px',
                        }}
                    >
                        <ProfileCard />
                    </div>

                    {/* Right Panel - Job Dashboard */}
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
                                        {t('activeJobs')} -{' '}
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
                                                isLoading={
                                                    inprogressLoading ||
                                                    revisionLoading
                                                }
                                            />
                                        )
                                    })}
                                </ul>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
                                    <p className="text-base font-semibold">
                                        {t('noActiveJobFound')}
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
                        </div>
                        <div className="sticky top-0 pt-8 pb-4 z-10 px-5 bg-background">
                            <div className="flex items-center justify-start gap-4 pl-2">
                                <p className="font-medium text-defaultp5 text-nowrap">
                                    {t('awaitingResponse')}
                                    <span className="pl-2 font-semibold text-text-muted">
                                        ({deliveredJobs?.length})
                                    </span>
                                </p>
                                <div className="bg-text-muted h-[1px] w-full" />
                            </div>
                        </div>
                        {deliveredJobs?.length ? (
                            <ul className="mt-5 space-y-4 px-6 pb-10">
                                {deliveredJobs?.map((aJob) => {
                                    return (
                                        <JobCard
                                            key={aJob.id}
                                            data={aJob}
                                            isLoading={deliveredLoading}
                                        />
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-text-muted">
                                <p className="text-base font-semibold">
                                    {t('noAwaitingResponseFound')}
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
                    </div>
                </div>
            </div>
        </>
    )
}
